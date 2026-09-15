import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Spot } from "@/data/spots";
import { cn } from "@/lib/utils";

type Props = {
  spot: Spot;
  selected: boolean;
  hovered: boolean;
  saved: boolean;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
};

export function SpotCard({ spot, selected, hovered, saved, onHover, onOpen, onSave }: Props) {
  return (
    <article
      data-spot-id={spot.id}
      onMouseEnter={() => onHover(spot.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onOpen(spot.id)}
      className={cn(
        "cursor-pointer border-b border-border bg-card px-4 py-4 transition-colors",
        hovered && "bg-secondary",
        selected && "bg-secondary ring-1 ring-inset ring-primary",
      )}
    >
      <div className="flex gap-3">
        <img
          src={spot.gallery[0]}
          alt={`${spot.name} in ${spot.district}, Kyoto`}
          loading="lazy"
          width={1280}
          height={864}
          className="h-20 w-24 shrink-0 border border-border object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base leading-tight">{spot.name}</h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {spot.district} · {spot.type}
              </p>
            </div>
            <button
              aria-label={saved ? "Remove from day plan" : "Save to day plan"}
              onClick={(e) => {
                e.stopPropagation();
                onSave(spot.id);
              }}
              className={cn(
                "border border-border p-1.5 transition-colors hover:border-foreground",
                saved && "border-primary text-primary",
              )}
            >
              {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {spot.summary}
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {[spot.era, spot.quiet, spot.light, spot.wifi].map((tag) => (
          <span
            key={tag}
            className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
