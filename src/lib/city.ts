import { GALLERY_POOL, type Spot } from "@/data/spots";
import type { CityResult, GeneratedPlace } from "@/lib/places.functions";

export function citySlug(city: string) {
  return city
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toSpot(place: GeneratedPlace, index: number, slug: string): Spot {
  const start = index % GALLERY_POOL.length;
  return {
    id: `${slug}-${index}-${citySlug(place.name)}`,
    name: place.name,
    localName: place.localName,
    district: place.district,
    type: place.type,
    coords: [place.lng, place.lat],
    address: place.address,
    hours: place.hours,
    gallery: [0, 1, 2].map((n) => GALLERY_POOL[(start + n) % GALLERY_POOL.length]!),
    crowd: place.crowd,
    minutes: Math.min(180, Math.max(15, Math.round(place.minutes))),
    wifi: place.wifi,
    light: place.light,
    era: place.era,
    quiet: place.quiet,
    seating: place.seating,
    drink: place.drink,
    summary: place.summary,
    vignette: place.vignette.slice(0, 3),
  };
}

export function resultToSpots(result: CityResult): Spot[] {
  const slug = citySlug(result.city);
  return result.places.map((p, i) => toSpot(p, i, slug));
}

const cacheKey = (city: string) => `rarefind-city-${citySlug(city)}-v1`;

export function readCityCache(city: string): Spot[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(city));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { spots: Spot[]; center: [number, number] };
    return Array.isArray(parsed.spots) && parsed.spots.length ? parsed.spots : null;
  } catch {
    return null;
  }
}

export function readCityCenter(city: string): [number, number] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(city));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { center: [number, number] };
    return parsed.center ?? null;
  } catch {
    return null;
  }
}

export function writeCityCache(city: string, spots: Spot[], center: [number, number]) {
  try {
    window.localStorage.setItem(cacheKey(city), JSON.stringify({ spots, center }));
  } catch {
    /* storage full or unavailable */
  }
}
