import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/explorer/SiteHeader";
import { FilterPanel, EMPTY_FILTERS, type Filters } from "@/components/explorer/FilterPanel";
import { SpotCard } from "@/components/explorer/SpotCard";
import { DetailDrawer } from "@/components/explorer/DetailDrawer";
import { ItineraryDrawer } from "@/components/explorer/ItineraryDrawer";
import { FACETS, SPOTS, DEFAULT_CITY, type FacetKey, type Spot } from "@/data/spots";
import { getCitySpots } from "@/lib/places.functions";
import { citySlug, readCityCache, readCityCenter, resultToSpots, writeCityCache } from "@/lib/city";
import { useItinerary } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

const MapView = lazy(() => import("@/components/explorer/MapView"));

const KYOTO_CENTER: [number, number] = [135.7595, 35.0116];

type ExplorerSearch = Partial<Record<FacetKey, string>> & {
  q?: string;
  spot?: string;
  city?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): ExplorerSearch => {
    const out: ExplorerSearch = {};
    for (const key of Object.keys(FACETS) as FacetKey[]) {
      const v = search[key];
      if (typeof v === "string" && v) out[key] = v;
    }
    if (typeof search["q"] === "string" && search["q"]) out.q = search["q"];
    if (typeof search["spot"] === "string" && search["spot"]) out.spot = search["spot"];
    if (typeof search["city"] === "string" && search["city"]) out.city = search["city"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "RareFind — Hidden Cafes, Courtyards & Architectural Gems" },
      {
        name: "description",
        content:
          "Type any city and RareFind maps its hidden architectural gems, quiet cafes and secret courtyards. Filter by light, quietness and era, then build a walkable day plan.",
      },
      { property: "og:title", content: "RareFind — Hidden Cafes, Courtyards & Architectural Gems" },
      {
        property: "og:description",
        content:
          "Type any city in the world and get its quietest hidden rooms and courtyards, mapped and ready to walk.",
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
  const [cityInput, setCityInput] = useState(search.city ?? DEFAULT_CITY);

  useEffect(() => setMounted(true), []);
  useEffect(() => setCityInput(search.city ?? DEFAULT_CITY), [search.city]);

  const city = search.city ?? DEFAULT_CITY;
  const isDefaultCity = citySlug(city) === citySlug(DEFAULT_CITY);

  const fetchCity = useServerFn(getCitySpots);

  const cityQuery = useQuery({
    queryKey: ["city-spots", citySlug(city)],
    enabled: mounted && !isDefaultCity,
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      const cached = readCityCache(city);
      const cachedCenter = readCityCenter(city);
      if (cached && cachedCenter) return { spots: cached, center: cachedCenter };
      const result = await fetchCity({ data: { city } });
      const spots = resultToSpots(result);
      writeCityCache(city, spots, result.center);
      return { spots, center: result.center };
    },
  });

  const spotPool: Spot[] = isDefaultCity ? SPOTS : (cityQuery.data?.spots ?? []);
  const center: [number, number] = isDefaultCity
    ? KYOTO_CENTER
    : (cityQuery.data?.center ?? KYOTO_CENTER);

  const itinerary = useItinerary(spotPool);

  const filters: Filters = useMemo(() => {
    const f = { ...EMPTY_FILTERS };
    for (const key of Object.keys(FACETS) as FacetKey[]) {
      f[key] = search[key] ? search[key]!.split(",").filter(Boolean) : [];
    }
    return f;
  }, [search]);

  const setSearch = useCallback(
    (patch: Partial<ExplorerSearch>) => {
      navigate({
        search: (prev: ExplorerSearch) => {
          const next: ExplorerSearch = { ...prev, ...patch };
          for (const k of Object.keys(next) as (keyof ExplorerSearch)[]) if (!next[k]) delete next[k];
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
    setSearch({ [key]: next.join(",") } as Partial<ExplorerSearch>);
  };

  const clearFilters = () =>
    setSearch(Object.fromEntries((Object.keys(FACETS) as FacetKey[]).map((k) => [k, ""])));

  const query = (search.q ?? "").trim().toLowerCase();

  const results = useMemo(
    () =>
      spotPool.filter((s) => {
        for (const key of Object.keys(FACETS) as FacetKey[]) {
          const selected = filters[key];
          if (selected.length && !selected.includes(s[key])) return false;
        }
        if (!query) return true;
        return [s.name, s.localName, s.district, s.type, s.summary, s.vignette.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);
      }),
    [spotPool, filters, query],
  );

  const selectedId = search.spot ?? null;
  const selectedSpot = selectedId ? (spotPool.find((s) => s.id === selectedId) ?? null) : null;

  // marker click -> scroll the matching card into view
  useEffect(() => {
    if (!selectedId) return;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-spot-id="${selectedId}"]`),
    ).filter((n) => n.offsetParent !== null);
    nodes[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId]);

  const handleSave = (id: string) => {
    const added = itinerary.toggle(id);
    toast[added ? "success" : "message"](
      added ? "Added to your day plan" : "Removed from your day plan",
      { description: spotPool.find((s) => s.id === id)?.name },
    );
  };

  const submitCity = (e: React.FormEvent) => {
    e.preventDefault();
    const value = cityInput.trim();
    if (!value) return;
    setSearch({ city: value, spot: "", q: "" });
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

  const loading = cityQuery.isFetching && !cityQuery.data;
  const failure = cityQuery.isError ? (cityQuery.error as Error).message : null;

  const panel = (
    <>
      <form onSubmit={submitCity} className="flex items-center gap-2 border-b border-border px-4 py-3">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <input
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Which city? e.g. Lisbon, Portugal"
          aria-label="City"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="shrink-0 border border-border px-2 py-1 text-[10px] uppercase tracking-[0.14em] hover:border-foreground"
        >
          Find
        </button>
      </form>

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

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="flex items-center justify-center gap-2 px-4 py-10 text-center text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading the streets of {city}…
          </p>
        )}
        {failure && (
          <div className="px-4 py-10 text-center text-xs text-muted-foreground">
            <p>{failure}</p>
            <button
              onClick={() => cityQuery.refetch()}
              className="mt-3 border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] hover:border-foreground"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !failure && results.length === 0 && (
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
                center={center}
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
