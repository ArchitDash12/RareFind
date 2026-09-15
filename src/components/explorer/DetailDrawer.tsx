import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, Copy, ExternalLink, X } from "lucide-react";
import type { Spot } from "@/data/spots";
import { FACET_LABELS } from "@/data/spots";
import { cn } from "@/lib/utils";
import { FALLBACK_PHOTO } from "@/lib/photos";

type Props = {
  spot: Spot | null;
  saved: boolean;
  onSave: (id: string) => void;
  onClose: () => void;
};

export function DetailDrawer({ spot, saved, onSave, onClose }: Props) {
  const [index, setIndex] = useState(0);
  if (!spot) return null;
  const image = spot.gallery[Math.min(index, spot.gallery.length - 1)];

  const copyAddress = async () => {
    const text = spot.address;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast.success("Address copied", { description: text });
    } catch {
      toast.error("Could not copy the address", { description: text });
    }
  };

  const facets: [string, string][] = [
    [FACET_LABELS.era, spot.era],
    [FACET_LABELS.wifi, spot.wifi],
    [FACET_LABELS.light, spot.light],
    [FACET_LABELS.quiet, spot.quiet],
    [FACET_LABELS.seating, spot.seating],
    [FACET_LABELS.drink, spot.drink],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-hidden />
      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-border bg-background">
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {spot.district} · {spot.type}
            </p>
            <h2 className="mt-1 text-2xl leading-tight">{spot.name}</h2>
            <p className="text-sm text-muted-foreground">{spot.localName}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="border border-border p-1.5 hover:border-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <img
            src={image || FALLBACK_PHOTO}
            alt={`${spot.name}, ${spot.district}`}
            width={1280}
            height={864}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== FALLBACK_PHOTO) {
                target.src = FALLBACK_PHOTO;
              }
            }}
            className="aspect-[3/2] w-full border-b border-border bg-muted object-cover"
          />
          <div className="flex gap-2 border-b border-border px-5 py-3">
            {spot.gallery.map((g, i) => (
              <button
                key={g + i}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={cn(
                  "h-14 w-20 border border-border",
                  i === index && "border-primary ring-1 ring-primary",
                )}
              >
                <img
                  src={g}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_PHOTO) {
                      target.src = FALLBACK_PHOTO;
                    }
                  }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <section className="border-b border-border px-5 py-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Cultural vignette
            </h3>
            {spot.vignette.map((p, i) => (
              <p key={i} className="mt-3 text-[13px] leading-relaxed">
                {p}
              </p>
            ))}
          </section>

          <section className="grid grid-cols-2 border-b border-border">
            {facets.map(([label, value]) => (
              <div key={label} className="border-b border-r border-border px-5 py-3 last:border-r-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-1 text-xs">{value}</p>
              </div>
            ))}
          </section>

          <section className="border-b border-border px-5 py-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Crowd profile
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed">{spot.crowd}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {spot.hours} · typical stay {spot.minutes} min
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{spot.address}</p>
          </section>
        </div>

        <footer className="grid grid-cols-3 border-t border-border">
          <button
            onClick={copyAddress}
            className="flex items-center justify-center gap-2 border-r border-border px-3 py-3 text-[11px] uppercase tracking-[0.14em] hover:bg-secondary"
          >
            <Copy className="h-3.5 w-3.5" /> Copy address
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coords[1]},${spot.coords[0]}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border-r border-border px-3 py-3 text-[11px] uppercase tracking-[0.14em] hover:bg-secondary"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Directions
          </a>
          <button
            onClick={() => onSave(spot.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 text-[11px] uppercase tracking-[0.14em]",
              saved ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Day plan"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
