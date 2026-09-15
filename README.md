# Kyoto's Hidden Paths

Build a Local & Cultural Explorer web app anchored to an opinionated, niche premise: "Hidden Architectural Gems, Machiya Cafes & Secret Courtyards of Kyoto" (with rich curated spots, vibes, and search).

Key features and requirements:
1. Split-View Explorer:
   - Interactive map using MapLibre GL JS / Leaflet / Mapbox with a custom muted dark slate tile style (e.g. CartoDB Dark Matter / Alidade dark slate tiles so it works out-of-the-box, compatible with Mapbox GL JS if configured).
   - Faceted filtering based on vibes: wifi speed, natural light, historical era, quietness/ambience, seating style, tea/coffee type.
   - Synchronized bidirectional interaction: hovering or clicking a spot card highlights the corresponding map marker; clicking a map marker scrolls smoothly to and highlights the card.

2. Detail Drawer / Story Page:
   - High-resolution photo gallery and crowd profile.
   - 2-3 paragraph cultural vignette explaining why each spot matters culturally and architecturally (not generic travel stats).
   - Practical utilities: "Copy Address" with toast feedback, directions link, and "Save to Day Plan".

3. Itinerary Builder:
   - Slide-out drawer or dedicated view showing saved spots compiled into an ordered sequence.
   - Routine summary: estimated walking distance, estimated total time, and step-by-step visit order.
   - Saved bookmarks/itineraries stored in localStorage so they persist across refreshes.

4. About & Method Page:
   - Dedicated view detailing how the spots were curated, editorial criteria, and the tech stack.

Extras & Layout:
- Sync active filters and selected spot pins with URL search parameters (shareable links).
- In-memory instant filtering from a typed local dataset (zero reload lag).
- Responsive: classic split view on desktop; on mobile, collapses into a draggable bottom drawer over the map.

Design System:
- Typography: Playfair Display / Newsreader for headings; JetBrains Mono for UI, badges, and body text. No Inter or Roboto.
- Color palette: Warm parchment background (#F9F8F5), deep ink text (#1C1B1A), crisp hairline borders (#E5E3DD), single terracotta accent (#C85A32), muted dark slate map canvas.
- Aesthetics: Sharp geometry, 1px solid borders, high contrast separation, no heavy drop shadows or glossy blur effects.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eef2b5d3-e780-472c-8164-ba1fa32c678e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
