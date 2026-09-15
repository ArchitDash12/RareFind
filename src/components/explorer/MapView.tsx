import { useEffect, useRef } from "react";
import type { Spot } from "@/data/spots";

type Props = {
  spots: Spot[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    base: {
      type: "raster" as const,
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors",
    },
    labels: {
      type: "raster" as const,
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    { id: "bg", type: "background" as const, paint: { "background-color": "#20242b" } },
    {
      id: "base",
      type: "raster" as const,
      source: "base",
      paint: { "raster-saturation": -0.3, "raster-contrast": 0.05 },
    },
    { id: "labels", type: "raster" as const, source: "labels", paint: { "raster-opacity": 0.85 } },
  ],
};

export default function MapView({ spots, selectedId, hoveredId, onSelect, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, { marker: any; el: HTMLElement }>>({});
  const readyRef = useRef(false);
  const handlers = useRef({ onSelect, onHover });
  handlers.current = { onSelect, onHover };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE as any,
        center: [135.7595, 35.0116],
        zoom: 12.1,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");
      mapRef.current = map;
      map.on("load", () => {
        readyRef.current = true;
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // sync markers with the filtered list
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = await import("maplibre-gl");
      const map = mapRef.current;
      if (cancelled || !map) return;
      const wanted = new Set(spots.map((s) => s.id));

      for (const [id, entry] of Object.entries(markersRef.current)) {
        if (!wanted.has(id)) {
          entry.marker.remove();
          delete markersRef.current[id];
        }
      }

      for (const spot of spots) {
        if (markersRef.current[spot.id]) continue;
        const el = document.createElement("button");
        el.className = "spot-marker";
        el.setAttribute("aria-label", spot.name);
        el.innerHTML = `<span class="dot"></span><span class="ring"></span>`;
        el.style.cssText =
          "width:22px;height:22px;background:transparent;border:0;position:relative;display:block;";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handlers.current.onSelect(spot.id);
        });
        el.addEventListener("mouseenter", () => handlers.current.onHover(spot.id));
        el.addEventListener("mouseleave", () => handlers.current.onHover(null));
        const marker = new maplibregl.Marker({ element: el }).setLngLat(spot.coords).addTo(map);
        markersRef.current[spot.id] = { marker, el };
      }
      paint();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spots]);

  function paint() {
    for (const [id, { el }] of Object.entries(markersRef.current)) {
      const active = id === selectedId;
      const hot = id === hoveredId;
      el.innerHTML = `
        <span style="
          position:absolute;inset:0;margin:auto;
          width:${active ? 16 : hot ? 14 : 10}px;height:${active ? 16 : hot ? 14 : 10}px;
          background:${active || hot ? "#C85A32" : "#F9F8F5"};
          border:1px solid ${active || hot ? "#F9F8F5" : "#8b8a86"};
          transform:rotate(45deg);
          transition:all .15s ease;
        "></span>
        ${active ? `<span style="position:absolute;inset:-6px;border:1px solid #C85A32;"></span>` : ""}
      `;
      el.style.zIndex = active ? "3" : hot ? "2" : "1";
    }
  }

  useEffect(paint);

  // fly to the selected spot
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const spot = spots.find((s) => s.id === selectedId);
    if (!spot) return;
    map.easeTo({ center: spot.coords, zoom: Math.max(map.getZoom(), 14), duration: 700 });
  }, [selectedId, spots]);

  return <div ref={containerRef} className="h-full w-full bg-slate-canvas" />;
}
