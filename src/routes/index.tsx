import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/explorer/SiteHeader";
import { FilterPanel, EMPTY_FILTERS, type Filters } from "@/components/explorer/FilterPanel";
import { SpotCard } from "@/components/explorer/SpotCard";
import { DetailDrawer } from "@/components/explorer/DetailDrawer";
import { ItineraryDrawer } from "@/components/explorer/ItineraryDrawer";
import { FACETS, SPOTS, spotById, type FacetKey } from "@/data/spots";
import { useItinerary } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

const MapView = lazy(() => import("@/components/explorer/MapView"));

type Search = Partial<Record<FacetKey, string>> & { q?: string; spot?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const out: Search = {};
    for (const key of Object.keys(FACETS) as FacetKey[]) {
      const v = search[key];
      if (typeof v === "string" && v) out[key] = v;
    }
    if (typeof search["q"] === "string" && search["q"]) out.q = search["q"];
    if (typeof search["spot"] === "string" && search["spot"]) out.spot = search["spot"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Kyoto Quiet Grid — Hidden Machiya Cafes & Secret Courtyards" },
      {
        name: "description",
        content:
          "A curated map of Kyoto's hidden architectural gems, machiya cafes and secret courtyards. Filter by light, quietness, era and brew, then build a walkable day plan.",
      },
      { property: "og:title", content: "Kyoto Quiet Grid — Hidden Machiya Cafes & Secret Courtyards" },
      {
        property: "og:description",
        content:
          "Filter Kyoto's quietest machiya cafes, courtyards and architectural gems by vibe, then build a walkable day plan.",
      },
    ],
  }),
  component: Explorer,
});

function Explorer() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sheet, setSheet] = useState(45);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itinerary = useItinerary();

  useEffect(() => setMounted(true), []);

  const filters: Filters = useMemo(() => {
    const f = { ...EMPTY_FILTERS };
    for (const key of Object.keys(FACETS) as FacetKey[]) {
      f[key] = search[key] ? search[key]!.split(",").filter(Boolean) : [];
    }
    return f;
  }, [search]);

  const setSearch = useCallback(
    (patch: Partial<Search>) => {
      navigate({
        search: (prev: Search) => {
          const next: Search = { ...prev, ...patch };
          for (const k of Object.keys(next) as (keyof Search)[]) if (!next[k]) delete next[k];
          return next;
        },
        replace: true,
      });
    },
    [navigate],
  );

  const toggleFacet = (key: FacetKey, value: string) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setSearch({ [key]: next.join(",") } as Partial<Search>);
  };

  const clearFilters = () =>
    setSearch(Object.fromEntries((Object.keys(FACETS) as FacetKey[]).map((k) => [k, ""])));

  const query = (search.q ?? "").trim().toLowerCase();

  const results = useMemo(
    () =>
      SPOTS.filter((s) => {
        for (const key of Object.keys(FACETS) as FacetKey[]) {
          const selected = filters[key];
          if (selected.length && !selected.includes(s[key])) return false;
        }
        if (!query) return true;
        return [s.name, s.kanji, s.district, s.type, s.summary, s.vignette.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);
      }),
    [filters, query],
  );

  const selectedId = search.spot ?? null;
  const selectedSpot = selectedId ? (spotById(selectedId) ?? null) : null;

  // marker click -> scroll the matching card into view
  useEffect(() => {
    if (!selectedId) return;
    const node = listRef.current?.querySelector(`[data-spot-id="${selectedId}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId]);

  const handleSave = (id: string) => {
    const added = itinerary.toggle(id);
    toast[added ? "success" : "message"](
      added ? "Added to your day plan" : "Removed from your day plan",
      { description: spotById(id)?.name },
    );
  };

  const startDrag = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const pct = ((window.innerHeight - ev.clientY) / window.innerHeight) * 100;
      setSheet(Math.min(90, Math.max(18, pct)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const panel = (
    <>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search.q ?? ""}
          onChange={(e) => setSearch({ q: e.target.value })}
          placeholder="Search names, districts, stories…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
      </div>
      <FilterPanel filters={filters} onToggle={toggleFacet} onClear={clearFilters} count={results.length} />
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {results.length === 0 && (
          <p className="px-4 py-10 text-center text-xs text-muted-foreground">
            No spots match those vibes. Loosen a filter.
          </p>
        )}
        {results.map((spot) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            selected={selectedId === spot.id}
            hovered={hoveredId === spot.id}
            saved={itinerary.has(spot.id)}
            onHover={setHoveredId}
            onOpen={(id) => setSearch({ spot: id })}
            onSave={handleSave}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <SiteHeader savedCount={itinerary.ids.length} onOpenPlan={() => setPlanOpen(true)} />

      <div className="relative flex min-h-0 flex-1">
        {/* desktop list */}
        <aside className="hidden w-[400px] shrink-0 flex-col border-r border-border md:flex">{panel}</aside>

        <div className="relative min-h-0 flex-1 bg-slate-canvas">
          {mounted && (
            <Suspense fallback={null}>
              <MapView
                spots={results}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={(id) => setSearch({ spot: id })}
                onHover={setHoveredId}
              />
            </Suspense>
          )}
        </div>

        {/* mobile draggable bottom drawer */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col border-t border-border bg-background md:hidden"
          style={{ height: `${sheet}%` }}
        >
          <div
            onPointerDown={startDrag}
            className="flex cursor-grab touch-none items-center justify-center border-b border-border py-2"
          >
            <span className="h-[2px] w-10 bg-border" />
          </div>
          <div className={cn("flex min-h-0 flex-1 flex-col")}>{panel}</div>
        </div>
      </div>

      <DetailDrawer
        spot={selectedSpot}
        saved={selectedSpot ? itinerary.has(selectedSpot.id) : false}
        onSave={handleSave}
        onClose={() => setSearch({ spot: "" })}
      />
      <ItineraryDrawer
        open={planOpen}
        spots={itinerary.spots}
        onClose={() => setPlanOpen(false)}
        onRemove={itinerary.remove}
        onMove={itinerary.move}
        onClear={itinerary.clear}
        onOpenSpot={(id) => {
          setPlanOpen(false);
          setSearch({ spot: id });
        }}
      />
    </div>
  );
}
