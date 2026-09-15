import { createServerFn } from "@tanstack/react-start";
import { Output, streamText, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { FACETS } from "@/data/spots";

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
});

export type GeneratedPlace = z.infer<typeof placeSchema>;

export type CityResult = {
  city: string;
  center: [number, number];
  places: GeneratedPlace[];
};

async function geocode(city: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
      { headers: { "User-Agent": "RareFind/1.0 (city explorer)", Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ lat: string; lon: string }>;
    const first = rows[0];
    if (!first) return null;
    return [Number(first.lon), Number(first.lat)];
  } catch {
    return null;
  }
}

export const getCitySpots = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<CityResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this app yet.");

    const center = await geocode(data.city);
    if (!center) throw new Error(`We couldn't find a city called "${data.city}".`);

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are the editor of RareFind, a guide to hidden architectural gems, atmospheric cafes and quiet courtyards.

City: ${data.city} (approx. centre lng ${center[0]}, lat ${center[1]}).

Return exactly 9 real, specific, lesser-known places in or immediately around this city. Favour historic buildings, tucked-away courtyards, old houses turned cafes, quiet libraries, hidden chapels, craft workshops and small tea or coffee rooms. Avoid famous landmarks and tourist-queue attractions.

For each place:
- name: the common name; localName: the name in the local language and script (repeat the name if the local language is English)
- type: a short label, e.g. "Courtyard cafe", "Secret courtyard", "Architectural gem"
- lat / lng: accurate decimal coordinates within roughly 20 km of the city centre
- address: a plausible full street address; hours: opening hours in one line
- crowd: one sentence on who you find there; minutes: typical visit length, 20-120
- summary: one vivid sentence, max 22 words
- vignette: exactly 3 paragraphs (60-90 words each) on the building's construction, its social and cultural history, and what the room feels like today. Write like an architecture critic, never like a travel brochure. No statistics, no "must-visit".
Use only the allowed values for the vibe tags.`;

    try {
      const result = streamText({
        model: gateway("google/gemini-3.8-flash"),
        prompt,
        output: Output.object({ schema: z.object({ places: z.array(placeSchema) }) }),
      });
      const output = await result.output;
      const places = (output.places ?? []).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      if (!places.length) throw new Error("No places came back for that city. Try another spelling.");
      return { city: data.city, center, places };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        console.error("RareFind generation failed", error.cause, String(error.text).slice(0, 2000));
        throw new Error("The recommendations came back malformed. Please try again.");
      }
      throw error;
    }
  });
