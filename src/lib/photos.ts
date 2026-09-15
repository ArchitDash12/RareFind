// Curated high-resolution architectural photography collections
// Selected for architectural restraint, spatial depth, and high visual quality

export type PlaceCategory = "museum" | "historic" | "cafe" | "courtyard" | "library";

const CATEGORY_POOLS: Record<PlaceCategory, string[]> = {
  museum: [
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80", // Sunlit neoclassical museum gallery with arches
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80", // Sculpture hall with high skylight
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80", // Minimalist concrete art pavilion
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80", // Grand classical museum colonnade
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80", // Fine art gallery hall in warm daylight
    "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1200&q=80", // Vaulted museum interior with curated pedestals
  ],
  historic: [
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80", // Old stone portal and weathered masonry
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80", // Ancient cloister with stone arches and afternoon sun
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", // Historic European terracotta rooftops and stone facade
    "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80", // Weathered stone castle tower and heritage courtyard
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80", // Roman stone monument and classical archway
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80", // Cobblestone alley with ancient timber beams
  ],
  cafe: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80", // Artisan wooden cafe counter with warm ambient light
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80", // Sun-drenched cafe corner with timber tables and linen
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80", // Dark roasted espresso bar and brass siphon gear
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1200&q=80", // Historic European coffee house interior with banquettes
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80", // Quiet brick-walled coffee room with reading lamp
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", // Intimate low-lit bistro seating and timber panels
  ],
  courtyard: [
    "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80", // Secluded green courtyard with stone fountain
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", // Dappled courtyard with weathered stone paving and vine
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Minimalist courtyard garden with calm water feature
    "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80", // Quiet walled cloister garden with stone benches
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80", // Peaceful garden sanctuary with stone lantern
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80", // Internal atrium courtyard filled with ferns and daylight
  ],
  library: [
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80", // Vaulted historic library with mahogany stacks
    "https://images.unsplash.com/photo-1507842229452-9e909a34be94?auto=format&fit=crop&w=1200&q=80", // Quiet reading table with warm desk lamp
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80", // Deep library aisle between ceiling-high archives
    "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80", // Grand reading hall with high arched windows
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80", // Atmospheric bookshop corner with timber floorboards
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80", // Sunlit academic archive with open research desk
  ],
};

export const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80";

export function detectCategory(text: string): PlaceCategory {
  const t = text.toLowerCase();
  if (/museum|gallery|art|exhibit|collection|sculpture/i.test(t)) return "museum";
  if (/cafe|coffee|espresso|bistro|kissaten|tea|roaster|bakery|pasteleria|pastelaria/i.test(t)) return "cafe";
  if (/library|archive|book|reading/i.test(t)) return "library";
  if (/garden|courtyard|patio|park|tsubo|cloister|plaza|square/i.test(t)) return "courtyard";
  if (/historic|castle|church|cathedral|chapel|monastery|palace|ruin|monument|tower|fort|arch/i.test(t)) return "historic";
  return "historic";
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns 3 distinct, category-matched architectural photographs.
 * If a real verified photo (e.g. from Wikipedia / Wikimedia Commons) is available,
 * it is assigned as the primary image (gallery[0]).
 */
export function getCategoryGallery(
  placeType: string,
  id: string,
  realImage?: string | null,
): string[] {
  const category = detectCategory(placeType);
  const pool = CATEGORY_POOLS[category];
  const hash = hashString(id);

  const idx1 = hash % pool.length;
  const idx2 = (hash + 2) % pool.length;
  const idx3 = (hash + 4) % pool.length;

  const backup1 = pool[idx1]!;
  const backup2 = pool[idx2] === backup1 ? pool[(idx2 + 1) % pool.length]! : pool[idx2]!;
  const backup3 =
    pool[idx3] === backup1 || pool[idx3] === backup2
      ? pool[(idx3 + 3) % pool.length]!
      : pool[idx3]!;

  if (realImage && realImage.startsWith("http")) {
    return [realImage, backup1, backup2];
  }

  return [backup1, backup2, backup3];
}
