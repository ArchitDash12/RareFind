import { ArrowDown, ArrowUp, Footprints, Trash2, X } from "lucide-react";
import type { Spot } from "@/data/spots";
import { formatDuration, routeSummary } from "@/lib/itinerary";

type Props = {
  open: boolean;
  spots: Spot[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onClear: () => void;
  onOpenSpot: (id: string) => void;
};

export function ItineraryDrawer({
  open,
  spots,
  onClose,
  onRemove,
  onMove,
  onClear,
  onOpenSpot,
}: Props) {
  if (!open) return null;
  const { km, walkMinutes, dwell, total } = routeSummary(spots);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-hidden />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-background">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-xl leading-none">Day plan</h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {spots.length} stops · saved on this device
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close day plan"
            className="border border-border p-1.5 hover:border-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid grid-cols-3 border-b border-border">
          {[
            ["Walking", `${km.toFixed(1)} km`],
            ["On foot", formatDuration(walkMinutes)],
            ["Total day", formatDuration(total)],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-border px-4 py-3 last:border-r-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {spots.length === 0 && (
            <p className="px-5 py-10 text-center text-xs text-muted-foreground">
              No stops yet. Save a spot from its story page to start building a route.
            </p>
          )}
          {spots.map((spot, i) => (
            <div key={spot.id} className="border-b border-border px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 border border-border px-2 py-0.5 text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onOpenSpot(spot.id)}
                    className="block truncate text-left text-base leading-tight hover:text-primary"
                  >
                    {spot.name}
                  </button>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {spot.district} · {spot.minutes} min stay
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    aria-label="Move earlier"
                    onClick={() => onMove(spot.id, -1)}
                    className="border border-border p-1 hover:border-foreground disabled:opacity-30"
                    disabled={i === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    aria-label="Move later"
                    onClick={() => onMove(spot.id, 1)}
                    className="border border-border p-1 hover:border-foreground disabled:opacity-30"
                    disabled={i === spots.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    aria-label="Remove stop"
                    onClick={() => onRemove(spot.id)}
                    className="border border-border p-1 text-primary hover:border-primary"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              {i < spots.length - 1 && (
                <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Footprints className="h-3 w-3" /> walk on to {spots[i + 1]!.district}
                </p>
              )}
            </div>
          ))}
        </div>

        {spots.length > 0 && (
          <footer className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {formatDuration(dwell)} in the rooms
            </span>
            <button
              onClick={onClear}
              className="border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-primary hover:border-primary"
            >
              Clear plan
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
