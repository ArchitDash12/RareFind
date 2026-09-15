import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/explorer/SiteHeader";
import { SPOTS } from "@/data/spots";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Method & Criteria — RareFind" },
      {
        name: "description",
        content:
          "How RareFind picks its spots: editorial criteria, fieldwork rules, vibe definitions and the tech behind the map.",
      },
      { property: "og:title", content: "Method & Criteria — RareFind" },
      {
        property: "og:description",
        content: "Editorial criteria, fieldwork rules and the tech stack behind RareFind.",
      },
    ],
  }),
  component: AboutPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-6 py-8 md:px-10">
      <h2 className="text-xl md:text-2xl">{title}</h2>
      <div className="mt-4 max-w-2xl space-y-3 text-[13px] leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader savedCount={0} />
      <main>
        <div className="border-b border-border px-6 py-10 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Method</p>
          <h1 className="mt-2 max-w-3xl text-3xl leading-tight md:text-5xl">
            Any city in the world, chosen for the building first and the coffee second.
          </h1>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
            {SPOTS.length} places in Kyoto were walked and documented by hand. For every other city
            in the world, RareFind queries real, verified cultural landmarks and historic spaces
            directly through OpenStreetMap and the Overpass API, filtered to the exact architectural
            criteria below.
          </p>
        </div>

        <Section title="What qualifies">
          <p>
            A spot enters the grid only if its architecture tells you something about how its city was
            built and lived in — a Kyoto machiya's tōriniwa, a Lisbon pátio, a Berlin Hinterhof, a
            Mexico City vecindad. A pleasant cafe in a generic building does not qualify, however good
            the pour-over is.
          </p>
          <p>
            Every entry must also be somewhere you can actually sit, stand or walk through without a
            reservation chain or a tour group. Places that have tipped into queue-management mode get
            removed rather than downgraded.
          </p>
        </Section>

        <Section title="Fieldwork rules">
          <p>
            Each place was visited at least twice, on a weekday and a weekend, at different hours.
            Wifi was measured on a phone in the seat furthest from the door. Quietness is a judgement
            made at the busiest observed moment, not the calmest.
          </p>
          <p>
            Nothing here is sponsored, gifted or comped. Owners were told about the listing only after
            the visits, and any owner who asks to be removed is removed within a day.
          </p>
        </Section>

        <Section title="How the vibes are defined">
          <p>
            <strong>Wifi speed</strong> — Fibre-fast means video calls hold; Workable means email and
            docs; Trickle means messages only; None by choice means the owner declines to offer it.
          </p>
          <p>
            <strong>Natural light</strong> — Skylit (top-lit or courtyard-lit), Dappled (filtered
            through shoji, sudare or foliage), Lantern-dim (electric light dominates at midday).
          </p>
          <p>
            <strong>Quietness</strong> — Library hush, Low murmur, Convivial. Measured by whether a
            conversation at the next table is intelligible.
          </p>
          <p>
            <strong>Historical era</strong> refers to the fabric of the building, not the business
            occupying it. A 2019 cafe inside an 1890s house is Meiji-Taisho.
          </p>
        </Section>

        <Section title="Photography and text">
          <p>
            Where verified documentary photography is catalogued in OpenStreetMap, Wikimedia
            Commons, or Wikipedia, it is rendered directly as the primary image. For all other
            spaces, galleries draw from curated, high-resolution architectural photography matched
            precisely to the building's spatial archetype (classical museum halls, historic stone
            masonry, artisan espresso bars, secluded cloister gardens, and vaulted reading rooms)
            without repetitive stock imagery.
          </p>
          <p>
            Vignettes explore architectural construction, materials, and civic history rather than
            travel statistics.
          </p>
        </Section>

        <Section title="Tech stack">
          <p>
            Built with React 19 and TanStack Start, styled with Tailwind CSS. The map is MapLibre GL
            JS drawing Esri's dark slate canvas, desaturated so the terracotta markers carry the
            visual focus. Cities are geocoded using OpenStreetMap's Nominatim service, and cultural
            spots are retrieved directly via the Overpass API with local fallback resolution. No
            generative LLM hallucinations are used in place generation.
          </p>
          <p>
            Once a city is loaded, filtering is instant and executed in memory — zero latency
            between a filter click and the map response. The active city, filter selections, and open
            drawer states are mirrored directly into the URL for easy sharing. Queried cities and
            your day plan are cached locally in browser storage and never leave your device.
          </p>
          <p>Typeset in Playfair Display and JetBrains Mono.</p>
        </Section>
      </main>
    </div>
  );
}
