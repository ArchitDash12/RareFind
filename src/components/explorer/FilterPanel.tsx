import { FACETS, FACET_LABELS, type FacetKey } from "@/data/spots";
import { cn } from "@/lib/utils";

export type Filters = Record<FacetKey, string[]>;

export const EMPTY_FILTERS: Filters = {
  wifi: [],
  light: [],
  era: [],
  quiet: [],
  seating: [],
  drink: [],
};

type Props = {
  filters: Filters;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: () => void;
  count: number;
};

export function FilterPanel({ filters, onToggle, onClear, count }: Props) {
  const active = (Object.keys(FACETS) as FacetKey[]).reduce((n, k) => n + filters[k].length, 0);

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {count} spots · {active} filters
        </span>
        {active > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] uppercase tracking-[0.18em] text-primary hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="max-h-[38vh] overflow-y-auto px-4 py-3">
        {(Object.keys(FACETS) as FacetKey[]).map((key) => (
          <div key={key} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {FACET_LABELS[key]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FACETS[key].map((value) => {
                const on = filters[key].includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => onToggle(key, value)}
                    aria-pressed={on}
                    className={cn(
                      "border border-border px-2 py-1 text-[11px] transition-colors",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:border-foreground",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
