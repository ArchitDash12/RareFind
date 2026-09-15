import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/explorer/SiteHeader";
import { SPOTS } from "@/data/spots";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Method & Criteria — Kyoto Quiet Grid" },
      {
        name: "description",
        content:
          "How the Kyoto Quiet Grid spots were curated: editorial criteria, fieldwork rules, vibe definitions and the tech behind the map.",
      },
      { property: "og:title", content: "Method & Criteria — Kyoto Quiet Grid" },
      {
        property: "og:description",
        content: "Editorial criteria, fieldwork rules and the tech stack behind the Kyoto Quiet Grid.",
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
            {SPOTS.length} places, chosen for the building first and the coffee second.
          </h1>
        </div>

        <Section title="What qualifies">
          <p>
            A spot enters the grid only if its architecture tells you something about how Kyoto was
            built and lived in — a machiya's tōriniwa, a tsubo-niwa's stack ventilation, a kura wrapped
            rather than demolished. A pleasant cafe in a generic building does not qualify, however
            good the pour-over is.
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
            Gallery images are illustrative compositions representing the character of each interior
            and courtyard rather than documentary photographs of the premises. Vignettes are written
            in-house, one place at a time, and describe construction and social history rather than
            travel statistics.
          </p>
        </Section>

        <Section title="Tech stack">
          <p>
            Built with React and TanStack Start, styled with Tailwind CSS. The map is MapLibre GL JS
            drawing CARTO Dark Matter raster tiles over OpenStreetMap data, desaturated to a muted
            slate canvas so the terracotta markers carry all the colour.
          </p>
          <p>
            The dataset is a typed local file, so filtering is instant and in memory — no network
            round trip between a filter click and a result. Active filters and the open spot are
            mirrored into the URL query string, so any view can be copied and shared. Your day plan
            lives in your browser's local storage and never leaves the device.
          </p>
          <p>Typeset in Playfair Display and JetBrains Mono.</p>
        </Section>
      </main>
    </div>
  );
}
