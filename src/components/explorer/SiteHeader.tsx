import { Link } from "@tanstack/react-router";
import { Map as MapIcon, NotebookPen } from "lucide-react";
import { RareFindLogo } from "@/components/explorer/RareFindLogo";

export function SiteHeader({ savedCount, onOpenPlan }: { savedCount: number; onOpenPlan?: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 sm:px-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap text-base leading-none tracking-tight sm:text-lg">
          <RareFindLogo size={22} />
          <span>RareFind</span>
        </Link>
        <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
          Hidden rooms · secret courtyards · anywhere
        </span>
      </div>
      <nav className="flex items-center gap-1.5 sm:gap-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] hover:border-foreground"
          activeOptions={{ exact: true }}
          activeProps={{ className: "border-foreground" }}
        >
          <MapIcon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Explore</span>
        </Link>
        <Link
          to="/about"
          className="border border-border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] hover:border-foreground"
          activeProps={{ className: "border-foreground" }}
        >
          Method
        </Link>
        {onOpenPlan && (
          <button
            onClick={onOpenPlan}
            className="flex items-center gap-1.5 border border-primary bg-primary px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-primary-foreground"
          >
            <NotebookPen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Day plan</span> ({savedCount})
          </button>
        )}
      </nav>
    </header>
  );
}
