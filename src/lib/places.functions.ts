import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FACETS } from "@/data/spots";
import { detectCategory } from "@/lib/photos";

const Input = z.object({ city: z.string().min(2).max(120) });

const placeSchema = z.object({
  name: z.string(),
  localName: z.string(),
  district: z.string(),
  type: z.string(),
  lat: z.number(),
  lng: z.number(),
  address: z.string(),
  hours: z.string(),
  crowd: z.string(),
  minutes: z.number(),
  wifi: z.enum(FACETS.wifi),
  light: z.enum(FACETS.light),
  era: z.enum(FACETS.era),
  quiet: z.enum(FACETS.quiet),
  seating: z.enum(FACETS.seating),
  drink: z.enum(FACETS.drink),
  summary: z.string(),
  vignette: z.array(z.string()),
  realImage: z.string().optional(),
});

export type GeneratedPlace = z.infer<typeof placeSchema>;

export type CityResult = {
  city: string;
  center: [number, number];
  places: GeneratedPlace[];
};

type GeocodeResult = {
  center: [number, number]; // [lng, lat]
  displayName: string;
  cityName: string;
};

const USER_AGENT = "RareFind/1.0 (https://rarefind.app; local explorer)";

async function geocodeCity(city: string): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(city)}`,
      { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      address?: {
        city?: string;
        town?: string;
        municipality?: string;
        state?: string;
        country?: string;
      };
    }>;
    const first = rows[0];
    if (!first) return null;

    const matchedName =
      first.address?.city ||
      first.address?.town ||
      first.address?.municipality ||
      first.display_name.split(",")[0] ||
      city;

    return {
      center: [Number(first.lon), Number(first.lat)],
      displayName: first.display_name,
      cityName: matchedName.trim(),
    };
  } catch {
    return null;
  }
}

type RawOsmSpot = {
  id: string | number;
  name: string;
  localName?: string;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  category: "museum" | "historic" | "cafe" | "courtyard" | "library";
  typeLabel: string;
  district: string;
  address: string;
};

function cleanName(name: string): string {
  return name.replace(/\s*\(.*?\)\s*/g, " ").trim();
}

function deriveTypeLabel(tags: Record<string, string>, category: string): string {
  const tourism = tags["tourism"];
  const name = tags["name"] || "";
  const amenity = tags["amenity"];
  const historic = tags["historic"];
  const leisure = tags["leisure"];

  if (tourism === "museum") {
    if (/art|arte|design/i.test(name)) return "Art museum";
    if (/history|história|geolog|science/i.test(name)) return "Curated museum";
    return "Cultural museum";
  }
  if (tourism === "gallery") return "Art gallery";
  if (amenity === "cafe") {
    if (/roast|specialty|craft/i.test(name)) return "Artisan roastery";
    if (/kissaten/i.test(name)) return "Heritage kissaten";
    if (/bistro/i.test(name)) return "Courtyard bistro";
    return "Quiet cafe";
  }
  if (amenity === "library") return "Historic reading room";
  if (leisure === "garden") return "Secret garden & courtyard";
  if (historic) {
    if (historic === "monastery") return "Historic cloister";
    if (historic === "castle" || historic === "palace") return "Heritage palace";
    if (historic === "monument") return "Historic monument";
    if (historic === "ruins") return "Ancient ruins";
    return "Architectural landmark";
  }
  return category === "cafe" ? "Neighbourhood cafe" : "Architectural gem";
}

function deriveDistrict(tags: Record<string, string>, fallback: string): string {
  return (
    tags["addr:suburb"] ||
    tags["addr:neighbourhood"] ||
    tags["addr:city_district"] ||
    tags["addr:quarter"] ||
    tags["addr:district"] ||
    fallback
  );
}

function deriveAddress(tags: Record<string, string>, district: string, city: string): string {
  const street = tags["addr:street"];
  const num = tags["addr:housenumber"];
  if (street && num) return `${num} ${street}, ${district}`;
  if (street) return `${street}, ${district}`;
  return `${district}, ${city}`;
}

function deriveEra(tags: Record<string, string>): (typeof FACETS.era)[number] {
  const dateStr = tags["start_date"] || tags["building:year"] || tags["year"];
  if (dateStr) {
    const match = dateStr.match(/\b(\d{3,4})\b/);
    if (match) {
      const year = parseInt(match[1]!, 10);
      if (year < 1800) return "Pre-1800";
      if (year < 1900) return "1800s";
      if (year < 1950) return "Early 1900s";
      if (year < 1985) return "Mid-century";
      return "Contemporary";
    }
  }

  const historic = tags["historic"];
  if (historic) {
    if (["castle", "monastery", "cathedral", "ruins", "archaeological_site"].includes(historic)) {
      return "Pre-1800";
    }
    return "1800s";
  }

  if (tags["tourism"] === "museum") return "1800s";
  if (tags["amenity"] === "library") return "1800s";
  if (tags["amenity"] === "cafe") return "Early 1900s";
  return "Mid-century";
}

function deriveCrowd(category: string): string {
  switch (category) {
    case "museum":
      return "Art researchers, sketchbook writers, and quiet visitors moving between halls.";
    case "cafe":
      return "Local neighborhood regulars with morning papers, writers, and solitary coffee enthusiasts.";
    case "library":
      return "Readers immersed in volumes, researchers, and seekers of absolute quiet.";
    case "courtyard":
      return "Almost empty at midday; occasional neighborhood residents pausing under the foliage.";
    case "historic":
    default:
      return "Architecture observers, quiet wanderers, and local historians tracing old masonry.";
  }
}

function deriveFacets(category: string, era: (typeof FACETS.era)[number]) {
  switch (category) {
    case "museum":
      return {
        wifi: "Workable" as const,
        light: "Skylit" as const,
        quiet: "Library hush" as const,
        seating: "Garden bench" as const,
        drink: "No drinks" as const,
        minutes: 75,
      };
    case "cafe":
      return {
        wifi: "Fibre-fast" as const,
        light: era === "Pre-1800" ? ("Lantern-dim" as const) : ("Dappled" as const),
        quiet: "Low murmur" as const,
        seating: "Timber table" as const,
        drink: "Hand-drip coffee" as const,
        minutes: 50,
      };
    case "library":
      return {
        wifi: "Workable" as const,
        light: "Skylit" as const,
        quiet: "Library hush" as const,
        seating: "Timber table" as const,
        drink: "Tea house" as const,
        minutes: 80,
      };
    case "courtyard":
      return {
        wifi: "None by choice" as const,
        light: "Dappled" as const,
        quiet: "Library hush" as const,
        seating: "Garden bench" as const,
        drink: "No drinks" as const,
        minutes: 35,
      };
    case "historic":
    default:
      return {
        wifi: "None by choice" as const,
        light: "Skylit" as const,
        quiet: "Library hush" as const,
        seating: "Timber table" as const,
        drink: "No drinks" as const,
        minutes: 60,
      };
  }
}

async function fetchWikipediaMedia(tags: Record<string, string>): Promise<{
  image?: string;
  extract?: string;
}> {
  const directImage = tags["image"];
  if (directImage && /^https?:\/\//i.test(directImage)) {
    return { image: directImage };
  }

  const commons = tags["wikimedia_commons"];
  if (commons) {
    const file = commons.replace(/^(File|Category):/i, "").trim();
    if (file && !file.toLowerCase().startsWith("category")) {
      const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;
      return { image: url };
    }
  }

  const wiki = tags["wikipedia"];
  if (wiki) {
    try {
      let lang = "en";
      let title = wiki.trim();
      if (title.includes(":")) {
        const parts = title.split(":");
        lang = parts[0]!.toLowerCase();
        title = parts.slice(1).join(":");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(
        `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        {
          headers: { "User-Agent": USER_AGENT },
          signal: controller.signal,
        },
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as {
          originalimage?: { source: string };
          thumbnail?: { source: string };
          extract?: string;
        };
        const imageSource = data.originalimage?.source || data.thumbnail?.source;
        const out: { image?: string; extract?: string } = {};
        if (imageSource) out.image = imageSource;
        if (data.extract) out.extract = data.extract.trim();
        return out;
      }
    } catch {
      // Ignore Wikipedia lookup failure and continue smoothly
    }
  }

  return {};
}

function buildVignette(
  name: string,
  typeLabel: string,
  district: string,
  era: string,
  extract?: string,
): string[] {
  const p1 = extract
    ? extract.length > 280
      ? extract.slice(0, 277) + "…"
      : extract
    : `${name} stands as an authentic embodiment of ${district}'s ${era.toLowerCase()} architectural lineage. Rather than submitting to contemporary commercial conversion, the structure retains its original load-bearing masonry, historic apertures, and unhurried proportions.`;

  const p2 = `Architecturally, the building avoids grand gestures in favor of tectonic honesty. Inside, high ceilings and deep-set fenestration temper the external city clamor, creating a sheltered microclimate where light shifts across raw lime plaster and aged timber joinery.`;

  const p3 = `To experience the space at its best, step inside during the quiet morning hours. The acoustic separation from the surrounding boulevard is immediate; conversation drops naturally into a measured cadence, preserved by thick historical walls that have absorbed generations of civic memory.`;

  return [p1, p2, p3];
}

function buildSummary(name: string, typeLabel: string, district: string, era: string): string {
  return `A preserved ${era.toLowerCase()} ${typeLabel.toLowerCase()} in ${district}, retaining historic proportions and serene architectural restraint.`;
}

// 1. Primary engine: Overpass API
async function queryOverpass(lat: number, lon: number, cityName: string): Promise<RawOsmSpot[]> {
  const ql = `[out:json][timeout:14];
(
  node["tourism"="museum"]["name"](around:6000,${lat},${lon});
  way["tourism"="museum"]["name"](around:6000,${lat},${lon});
  node["historic"]["name"](around:6000,${lat},${lon});
  way["historic"]["name"](around:6000,${lat},${lon});
  node["amenity"="cafe"]["name"](around:6000,${lat},${lon});
  way["amenity"="cafe"]["name"](around:6000,${lat},${lon});
  node["tourism"="gallery"]["name"](around:6000,${lat},${lon});
  node["amenity"="library"]["name"](around:6000,${lat},${lon});
  node["leisure"="garden"]["name"](around:6000,${lat},${lon});
);
out center 40;`;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
  ];

  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(ep, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": USER_AGENT,
        },
        body: "data=" + encodeURIComponent(ql),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) continue;

      const data = (await res.json()) as {
        elements: Array<{
          id: number | string;
          type: string;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: Record<string, string>;
        }>;
      };

      if (!data.elements || !data.elements.length) continue;

      const results: RawOsmSpot[] = [];
      const seenNames = new Set<string>();

      for (const el of data.elements) {
        if (!el.tags || !el.tags["name"]) continue;
        const name = cleanName(el.tags["name"]);
        const nameKey = name.toLowerCase();
        if (seenNames.has(nameKey) || name.length < 3) continue;
        seenNames.add(nameKey);

        const latVal = el.center ? el.center.lat : el.lat;
        const lonVal = el.center ? el.center.lon : el.lon;
        if (!latVal || !lonVal || !Number.isFinite(latVal) || !Number.isFinite(lonVal)) continue;

        const category = detectCategory(
          `${el.tags["tourism"] || ""} ${el.tags["historic"] || ""} ${el.tags["amenity"] || ""} ${name}`,
        );
        const district = deriveDistrict(el.tags, cityName);
        const address = deriveAddress(el.tags, district, cityName);
        const typeLabel = deriveTypeLabel(el.tags, category);

        results.push({
          id: el.id,
          name,
          localName: el.tags["name:local"] || el.tags["name:en"] || name,
          lat: latVal,
          lng: lonVal,
          tags: el.tags,
          category,
          typeLabel,
          district,
          address,
        });

        if (results.length >= 15) break;
      }

      if (results.length >= 4) return results;
    } catch {
      // Continue to mirror if this endpoint failed
    }
  }

  return [];
}

// 2. Secondary engine: Nominatim POI search fallback
async function queryNominatimFallback(cityName: string): Promise<RawOsmSpot[]> {
  const searches = [
    `museums in ${cityName}`,
    `historic in ${cityName}`,
    `cafes in ${cityName}`,
  ];

  const results: RawOsmSpot[] = [];
  const seenNames = new Set<string>();

  for (const q of searches) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`,
        { headers: { "User-Agent": USER_AGENT } },
      );
      if (!res.ok) continue;
      const rows = (await res.json()) as Array<{
        place_id: number;
        name: string;
        lat: string;
        lon: string;
        type: string;
        class: string;
        address?: Record<string, string>;
      }>;

      for (const row of rows) {
        if (!row.name) continue;
        const name = cleanName(row.name);
        const nameKey = name.toLowerCase();
        if (seenNames.has(nameKey) || name.length < 3) continue;
        seenNames.add(nameKey);

        const latVal = Number(row.lat);
        const lonVal = Number(row.lon);
        if (!Number.isFinite(latVal) || !Number.isFinite(lonVal)) continue;

        const tags: Record<string, string> = {
          name,
          amenity: row.class === "amenity" ? row.type : "",
          tourism: row.class === "tourism" ? row.type : "",
          historic: row.class === "historic" ? row.type : "",
        };

        const category = detectCategory(`${row.class} ${row.type} ${name}`);
        const district =
          row.address?.["suburb"] ||
          row.address?.["neighbourhood"] ||
          row.address?.["city_district"] ||
          cityName;
        const street = row.address?.["road"];
        const address = street ? `${street}, ${district}` : `${district}, ${cityName}`;

        results.push({
          id: row.place_id,
          name,
          localName: name,
          lat: latVal,
          lng: lonVal,
          tags,
          category,
          typeLabel: deriveTypeLabel(tags, category),
          district,
          address,
        });

        if (results.length >= 12) break;
      }
    } catch {
      // Continue next query
    }
  }

  return results;
}

export const getCitySpots = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<CityResult> => {
    const geo = await geocodeCity(data.city);
    if (!geo) {
      throw new Error(`We couldn't find a city called "${data.city}". Please check the spelling.`);
    }

    // 1. Query Overpass API
    let rawSpots = await queryOverpass(geo.center[1], geo.center[0], geo.cityName);

    // 2. If Overpass timed out or was congested, fall back to Nominatim POIs
    if (!rawSpots || rawSpots.length < 4) {
      const fallbackSpots = await queryNominatimFallback(geo.cityName);
      if (fallbackSpots.length) {
        rawSpots = [...rawSpots, ...fallbackSpots];
      }
    }

    if (!rawSpots.length) {
      throw new Error(
        `No cultural spots could be retrieved for ${data.city}. Please try another city or wider spelling.`,
      );
    }

    // Process top 9-12 verified spots
    const selected = rawSpots.slice(0, 10);

    // Fetch any Wikipedia media in parallel (with safe timeouts)
    const mediaList = await Promise.all(
      selected.map((s) => fetchWikipediaMedia(s.tags)),
    );

    const places: GeneratedPlace[] = selected.map((spot, i) => {
      const media = mediaList[i] || {};
      const era = deriveEra(spot.tags);
      const facets = deriveFacets(spot.category, era);
      const crowd = deriveCrowd(spot.category);
      const hours = spot.tags["opening_hours"] || "10:00 – 19:00, daily";
      const vignette = buildVignette(spot.name, spot.typeLabel, spot.district, era, media.extract);
      const summary = buildSummary(spot.name, spot.typeLabel, spot.district, era);

      const place: GeneratedPlace = {
        name: spot.name,
        localName: spot.localName || spot.name,
        district: spot.district,
        type: spot.typeLabel,
        lat: spot.lat,
        lng: spot.lng,
        address: spot.address,
        hours,
        crowd,
        minutes: facets.minutes,
        wifi: facets.wifi,
        light: facets.light,
        era,
        quiet: facets.quiet,
        seating: facets.seating,
        drink: facets.drink,
        summary,
        vignette,
      };

      if (media.image) {
        place.realImage = media.image;
      }

      return place;
    });

    return {
      city: data.city,
      center: geo.center,
      places,
    };
  });
