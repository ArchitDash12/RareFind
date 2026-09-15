# RareFind — any city in the world

Turn the Kyoto-only explorer into a global one: the visitor types a city, and the app suggests hidden architectural gems, cafes and quiet courtyards there. Kyoto stays as the example that loads first.

## The map key question

The map does not need any API key. It draws Esri's free dark-grey world tiles, which answer fine right now. The "API key required" watermark you saw comes from an older version still sitting in your browser — a hard refresh clears it. If it persists after the update, I'll swap the tile source; no key from you needed either way.

## What changes

**Name** — "Kyoto Quiet Grid" becomes **RareFind** everywhere: header, page titles, share previews, the Method page copy.

**City search** — a prominent city field at the top of the explorer (and a welcome state when no city is chosen). Typing a city and pressing enter:
1. Looks up that city's location so the map can fly there.
2. Asks for a curated set of 8–10 places in that city, each with the same depth as the Kyoto entries: name, local-language name, district, address, opening hours, crowd profile, visit length, the six vibe tags, a one-line summary and a three-paragraph cultural vignette.
3. Drops pins, fills the list, and the whole existing experience (filters, hover sync, detail drawer, day plan) works unchanged.

**Recommendations are generated per city** using the built-in AI, then kept in the browser so revisiting a city is instant and free. Kyoto's ten hand-written spots stay bundled and load without any generation.

**Vibe filters go global** — the era and drink options stop being Japan-specific: eras become Pre-1800 / 1800s / Early 1900s / Mid-century / Contemporary, drinks become Hand-drip coffee / Espresso bar / Tea house / Natural wine & aperitivo / No drinks. Light, quietness, wifi and seating stay, with seating generalised (Floor seating / Counter stool / Timber table / Garden bench).

**Shareable links** keep working: the chosen city joins the filters and open spot in the address bar.

**Photos** — the six existing images are reused across generated spots; the Method page will say plainly that imagery is illustrative, not photographs of the actual premises.

## Technical notes

- New server function `src/lib/places.functions.ts`: `getCitySpots({ city })` calls the Lovable AI Gateway (`google/gemini-2.5-flash`) with a strict JSON schema matching the `Spot` type, validated with Zod; a second call geocodes the city via OpenStreetMap Nominatim for map centre and bounds. Handler reads `LOVABLE_API_KEY` inside `.handler()`.
- Client: `useQuery` keyed on the city (never a route loader, so prerender stays public), results cached in `localStorage` under `rarefind-city-<slug>-v1`.
- `src/data/spots.ts` keeps Kyoto's ten entries as the seeded city and exports the generalised `FACETS`; existing Kyoto entries are remapped to the new era/seating/drink values.
- `MapView` gains a `center` prop and fits to the city on change; markers, hover and fly-to logic unchanged.
- Failures (unknown city, gateway rate limit, no credits) surface as an inline message with a retry, not a blank map.
