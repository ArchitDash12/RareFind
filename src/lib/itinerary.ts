import { useCallback, useEffect, useState } from "react";
import { SPOTS, type Spot } from "@/data/spots";

const KEY = "kyoto-day-plan-v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useItinerary() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      persist(next);
      return !ids.includes(id);
    },
    [ids, persist],
  );

  const remove = useCallback((id: string) => persist(ids.filter((x) => x !== id)), [ids, persist]);
  const clear = useCallback(() => persist([]), [persist]);

  const move = useCallback(
    (id: string, dir: -1 | 1) => {
      const i = ids.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ids.length) return;
      const next = [...ids];
      const a = next[i]!;
      const b = next[j]!;
      next[i] = b;
      next[j] = a;
      persist(next);
    },
    [ids, persist],
  );

  const spots = ids.map((id) => SPOTS.find((s) => s.id === id)).filter(Boolean) as Spot[];

  return { ids, spots, toggle, remove, clear, move, has: (id: string) => ids.includes(id) };
}

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function routeSummary(spots: Spot[]) {
  let km = 0;
  for (let i = 1; i < spots.length; i++)
    km += haversineKm(spots[i - 1]!.coords, spots[i]!.coords) * 1.3;
  const dwell = spots.reduce((t, s) => t + s.minutes, 0);
  const walkMinutes = Math.round((km / 4.8) * 60);
  return { km, walkMinutes, dwell, total: dwell + walkMinutes };
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}
