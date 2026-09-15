# RareFind

> **Hidden architectural gems, quiet cafes & secret courtyards — anywhere in the world.**  
> Chosen for the building first, and the coffee second.

---

## Overview

**RareFind** is an opinionated cultural explorer and day-planning tool designed to discover atmospheric, historic, and architecturally significant spaces. Rather than prioritizing commercial popularity or queue-heavy tourist magnets, RareFind maps places where construction, light, and spatial heritage tell an authentic story of how a city was built and lived in.

Kyoto's hand-documented machiyas, Lisbon's secluded courtyards, Roman cloisters, or Berlin's quiet Hinterhöfe — explore verified cultural spots on an interactive dark slate map, inspect rich architectural vignettes, filter by nuanced environmental qualities, and compile a walkable day plan.

---

## Key Features

### 1. Dual-Engine OpenStreetMap & Overpass Integration
- **Real, Verified Spots**: Replaced hallucinated AI place generation with direct, real-time queries against **OpenStreetMap (OSM)** and the **Overpass API**.
- **Accurate Coordinates & Metadata**: Every searched city pulls real cultural landmarks (museums, historic monuments, independent kissatens/cafes, cloisters, quiet reading rooms) with exact geographic coordinates, street addresses, and opening hours.
- **Resilient Fallback**: If public Overpass servers experience traffic or timeouts, an automated Nominatim POI resolution pipeline ensures search results are always delivered without interruption.

### 2. Authentic Photography System
- **Verified Documentary Photos**: Automatically resolves real Wikimedia Commons and Wikipedia images when landmarks possess catalogued media.
- **Category-Matched Architectural Photography**: For spots without direct image tags, RareFind draws from curated collections of high-resolution architectural photography matched to spatial archetypes (*museum galleries*, *historic masonry*, *artisan espresso bars*, *walled gardens*, and *vaulted reading rooms*), eliminating repetitive stock photos.
- **Fail-Safe Loading**: Built-in image error fallbacks prevent broken image icons across spot cards and drawers.

### 3. Split-View Interactive Map
- **MapLibre GL JS**: Dark gray canvas styled with desaturated tiles and terracotta markers (`#C85A32`).
- **Bidirectional Sync**: Hovering or clicking a spot card focuses and highlights the map marker; clicking a marker smoothly scrolls and expands the corresponding card.

### 4. Vibe & Environmental Faceting
Filter in real time with instant in-memory execution:
- **Historical Era**: Pre-1800, 1800s, Early 1900s, Mid-century, Contemporary
- **Natural Light**: Skylit, Dappled, Lantern-dim
- **Quietness**: Library hush, Low murmur, Convivial
- **Wifi Speed**: Fibre-fast, Workable, Trickle, None by choice
- **Seating Style**: Floor seating, Counter stool, Timber table, Garden bench
- **Drinks**: Hand-drip coffee, Espresso bar, Tea house, Natural wine & aperitivo, No drinks

### 5. Walkable Day Plan & Itinerary
- Save spots to your personal day plan with one click.
- Reorder stops, review estimated walking times, copy addresses with toast notifications, and retain your itinerary in local storage across browser sessions.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start)
- **Routing & State**: [TanStack Router](https://tanstack.com/router) & [TanStack Query](https://tanstack.com/query)
- **Mapping**: [MapLibre GL JS](https://maplibre.org/)
- **Geodata & Places**: [OpenStreetMap](https://www.openstreetmap.org/) via [Overpass API](https://overpass-api.de/) & [Nominatim](https://nominatim.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Bundler**: [Vite 8](https://vitejs.dev/) + [Nitro](https://nitro.unjs.io/)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- `npm` or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArchitDash12/RareFind.git
   cd RareFind
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:8080`**.

### Building for Production

Compile the TypeScript bundle and generate production assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

Type check the codebase:
```bash
npx tsc --noEmit
```

---

## Project Structure

```
RareFind/
├── public/
│   ├── favicon.svg          # Vector SVG architectural emblem
│   ├── favicon.ico          # Binary favicon icon
│   ├── apple-touch-icon.png # High-res touch icon
│   └── logo.jpg             # Full brand logo asset
├── src/
│   ├── assets/              # Curated static imagery
│   ├── components/
│   │   ├── explorer/        # SpotCard, MapView, DetailDrawer, Itinerary, Header
│   │   └── ui/              # Radix & Sonner UI primitives
│   ├── data/
│   │   └── spots.ts         # Hand-documented Kyoto dataset and facet definitions
│   ├── lib/
│   │   ├── city.ts          # Cache management and spot transformation
│   │   ├── error-reporting.ts # Clean runtime logger
│   │   ├── itinerary.ts     # Day plan state and persistence
│   │   ├── photos.ts        # Category-matched architectural photography service
│   │   └── places.functions.ts # Overpass API + Nominatim OSM search engine
│   ├── routes/
│   │   ├── __root.tsx       # Root layout, meta tags, and font imports
│   │   ├── about.tsx        # Method, criteria, and fieldwork principles
│   │   └── index.tsx        # Split-view explorer application
│   ├── styles.css           # Design tokens and custom styles
│   └── routeTree.gen.ts     # Generated TanStack route tree
├── tsconfig.json
└── vite.config.ts
```

---

## License

Created for architectural discovery. Distributed under the MIT License.
