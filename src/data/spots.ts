import spot1 from "@/assets/spot-1.jpg";
import spot2 from "@/assets/spot-2.jpg";
import spot3 from "@/assets/spot-3.jpg";
import spot4 from "@/assets/spot-4.jpg";
import spot5 from "@/assets/spot-5.jpg";
import spot6 from "@/assets/spot-6.jpg";

export const FACETS = {
  wifi: ["Fibre-fast", "Workable", "Trickle", "None by choice"],
  light: ["Skylit", "Dappled", "Lantern-dim"],
  era: ["Pre-1800", "1800s", "Early 1900s", "Mid-century", "Contemporary"],
  quiet: ["Library hush", "Low murmur", "Convivial"],
  seating: ["Floor seating", "Counter stool", "Timber table", "Garden bench"],
  drink: [
    "Hand-drip coffee",
    "Espresso bar",
    "Tea house",
    "Natural wine & aperitivo",
    "No drinks",
  ],
} as const;

export const GALLERY_POOL = [spot1, spot2, spot3, spot4, spot5, spot6];

export const DEFAULT_CITY = "Kyoto, Japan";

export type FacetKey = keyof typeof FACETS;
export type FacetValue<K extends FacetKey> = (typeof FACETS)[K][number];

export const FACET_LABELS: Record<FacetKey, string> = {
  wifi: "Wifi speed",
  light: "Natural light",
  era: "Historical era",
  quiet: "Quietness",
  seating: "Seating style",
  drink: "Tea / coffee",
};

export type Spot = {
  id: string;
  name: string;
  localName: string;
  district: string;
  type: string;
  coords: [number, number];
  address: string;
  hours: string;
  gallery: string[];
  crowd: string;
  minutes: number;
  wifi: FacetValue<"wifi">;
  light: FacetValue<"light">;
  era: FacetValue<"era">;
  quiet: FacetValue<"quiet">;
  seating: FacetValue<"seating">;
  drink: FacetValue<"drink">;
  summary: string;
  vignette: string[];
};

export const SPOTS: Spot[] = [
  {
    id: "kurasu-roji",
    name: "Roji no Kurasu",
    localName: "路地の蔵",
    district: "Nishijin",
    type: "Machiya cafe",
    coords: [135.7448, 35.0295],
    address: "312 Daikoku-cho, Kamigyo-ku, Kyoto 602-8226",
    hours: "08:30 – 17:00, closed Wednesday",
    gallery: [spot1, spot4, spot3],
    crowd: "Weavers' descendants at 9am, two or three remote workers by noon, nobody after four.",
    minutes: 60,
    wifi: "Fibre-fast",
    light: "Dappled",
    era: "Early 1900s",
    quiet: "Library hush",
    seating: "Counter stool",
    drink: "Hand-drip coffee",
    summary: "A weaver's storehouse converted with almost no demolition — the loom beams still carry the roof.",
    vignette: [
      "Nishijin's weaving families built their machiya long and narrow to dodge a frontage tax, which is why this cafe is eleven metres deep and barely four wide. The front room was the shop face, the middle room the loom hall, and the rear kura — the fireproof storehouse — is where you now drink coffee under plaster walls a foot thick.",
      "The conversion, done in 2016 by a Kyoto carpenter rather than an architecture office, is deliberately reversible. Nothing structural was removed; the counter is a free-standing insert, bolted to nothing. You can read the old loom anchor points in the floorboards as a line of darker plugs running toward the garden.",
      "Come before ten and the tōriniwa — the earth-floored corridor that runs the whole length of the house — still holds the night's cold. It is the clearest surviving demonstration in the district of why these houses breathed so well before air conditioning.",
    ],
  },
  {
    id: "tsuboniwa-hachi",
    name: "Tsubo-niwa Hachi",
    localName: "坪庭 八",
    district: "Shinmachi",
    type: "Secret courtyard",
    coords: [135.7554, 35.0042],
    address: "8 Kikuya-cho, Nakagyo-ku, Kyoto 604-8166",
    hours: "11:00 – 18:00, weekends only",
    gallery: [spot2, spot5, spot1],
    crowd: "Almost always empty. Occasionally a moss photographer with a tripod and an apology.",
    minutes: 35,
    wifi: "None by choice",
    light: "Skylit",
    era: "Pre-1800",
    quiet: "Library hush",
    seating: "Garden bench",
    drink: "Tea house",
    summary: "A four-tatami courtyard that exists purely to move air and light through a merchant house.",
    vignette: [
      "A tsubo-niwa is a courtyard of roughly one tsubo — 3.3 square metres. It is not decorative in origin. Sandwiched between a machiya's deep rooms, it acts as a chimney: sun warms the courtyard air, the air rises, and cooler air is drawn in from the street entrance across the whole house.",
      "This one, behind a kimono-lining merchant's house of the late Edo period, keeps its original stone basin and a single maple chosen for its thin canopy. The gravel is raked toward the drain, not for aesthetics but because Kyoto's summer rain arrives sideways.",
      "The family opens the rear room on weekends and serves usucha to whoever finds the lane. There is no sign and no wifi, and the owner considers both facts to be part of the offer.",
    ],
  },
  {
    id: "kissa-showa",
    name: "Kissa Hakuba",
    localName: "喫茶 白馬",
    district: "Kawaramachi",
    type: "Machiya cafe",
    coords: [135.7681, 35.0055],
    address: "45 Nakanocho, Nakagyo-ku, Kyoto 604-8035",
    hours: "09:00 – 21:00, daily",
    gallery: [spot4, spot1, spot3],
    crowd: "Retired regulars with newspapers, jazz obsessives, and a slow rotation of students.",
    minutes: 75,
    wifi: "Trickle",
    light: "Lantern-dim",
    era: "Mid-century",
    quiet: "Low murmur",
    seating: "Timber table",
    drink: "Espresso bar",
    summary: "Post-war kissaten interior, untouched since 1968: velour booths, siphon bar, smoke-cured ceiling.",
    vignette: [
      "The Showa kissaten was Japan's answer to the reading room — a place to rent a chair and an hour. Hakuba's owner has refused every renovation quote since his father's death, and the result is a nearly intact 1968 interior: mustard velour, chrome trim, a Hario siphon bar operated with laboratory seriousness.",
      "Architecturally it is a hybrid that Kyoto produced in quantity and is now losing fast — a timber machiya frame refitted with a modernist shopfront in aluminium and glass. Look up past the light fittings and you can still see the original beam grid above the dropped ceiling.",
      "The coffee is dark, over-extracted by third-wave standards, and exactly right for the room. Do not ask for oat milk; do ask which record is playing.",
    ],
  },
  {
    id: "gion-kura",
    name: "Higashiyama Kura",
    localName: "東山蔵",
    district: "Higashiyama",
    type: "Architectural gem",
    coords: [135.7784, 35.0004],
    address: "570 Gionmachi Minamigawa, Higashiyama-ku, Kyoto 605-0074",
    hours: "10:00 – 16:30, closed Monday",
    gallery: [spot6, spot2, spot5],
    crowd: "Design students, visiting architects, and a caretaker who will talk for an hour if asked.",
    minutes: 50,
    wifi: "Workable",
    light: "Skylit",
    era: "Contemporary",
    quiet: "Library hush",
    seating: "Garden bench",
    drink: "Tea house",
    summary: "A 1920s storehouse wrapped in board-formed concrete — the clearest old-meets-new lesson in the city.",
    vignette: [
      "The original kura survived the war, two typhoons, and a 1980s plan to demolish it for parking. The 2011 intervention keeps the storehouse intact and builds a concrete envelope around it, so you circulate between the two skins as if walking through an archaeological section.",
      "The board-formed concrete was cast against cedar planks milled to match the storehouse's own cladding, so the new surface carries the grain of the old material. It is a quiet argument against the glass-box approach that Kyoto's preservation ordinances were written to prevent.",
      "Take the north passage first. The gap narrows to 700mm, then opens onto the moss court, and the compression-release sequence is the whole point of the building.",
    ],
  },
  {
    id: "arashiyama-hanare",
    name: "Hanare Saga",
    localName: "離れ 嵯峨",
    district: "Arashiyama",
    type: "Machiya cafe",
    coords: [135.6702, 35.0165],
    address: "20-3 Sagatenryuji, Ukyo-ku, Kyoto 616-8385",
    hours: "09:00 – 17:00, closed Tuesday",
    gallery: [spot5, spot2, spot6],
    crowd: "Early walkers escaping the bamboo grove crowds; empty from 2pm onward.",
    minutes: 55,
    wifi: "Workable",
    light: "Dappled",
    era: "Early 1900s",
    quiet: "Low murmur",
    seating: "Floor seating",
    drink: "Tea house",
    summary: "A detached tea annexe on a farmhouse plot, ten minutes' walk from the crowds and utterly unlike them.",
    vignette: [
      "Hanare means the detached building — the annexe a family built when the main house filled up. This one, from around 1912, was a tea room for a landowning farm family and sits at the far end of a persimmon garden.",
      "Its proportions follow tea-room convention rather than domestic convention: a low entry, a tokonoma alcove sized for one scroll, and a window placed to frame the garden from a kneeling eye level rather than a standing one. Sit on the floor and the composition snaps into place.",
      "The current owners serve usucha whisked to order and a single wagashi that changes with the month. They cap the room at six people, which is why the bamboo grove five minutes away never leaks into it.",
    ],
  },
  {
    id: "teramachi-hikari",
    name: "Hikari Botan",
    localName: "光牡丹",
    district: "Teramachi",
    type: "Machiya cafe",
    coords: [135.7663, 35.0114],
    address: "112 Tenshocho, Nakagyo-ku, Kyoto 604-0915",
    hours: "08:00 – 19:00, daily",
    gallery: [spot4, spot6, spot1],
    crowd: "Freelancers on laptops until three, then a shift to couples and booksellers.",
    minutes: 90,
    wifi: "Fibre-fast",
    light: "Skylit",
    era: "Contemporary",
    quiet: "Low murmur",
    seating: "Timber table",
    drink: "Hand-drip coffee",
    summary: "A machiya gutted to its frame and re-roofed in polycarbonate — controversial, and very good.",
    vignette: [
      "Purists dislike this one. The 2019 renovation stripped the house to its post-and-beam skeleton and replaced the rear roof with translucent polycarbonate, flooding the old loom hall with light it never had.",
      "What survives is the structure itself, now fully legible: you can trace every joint, every ageing splice where a beam was scarfed rather than replaced. It reads as a diagram of Kyoto timber framing that an intact house would keep hidden.",
      "It is also the only spot on this list with a power outlet at every seat, which is either a betrayal or a kindness depending on your afternoon.",
    ],
  },
  {
    id: "fushimi-idoba",
    name: "Idoba Courtyard",
    localName: "井戸場",
    district: "Fushimi",
    type: "Secret courtyard",
    coords: [135.7617, 34.9327],
    address: "6 Minamihama-cho, Fushimi-ku, Kyoto 612-8043",
    hours: "Daylight hours, free entry",
    gallery: [spot2, spot3, spot5],
    crowd: "Neighbours drawing water, the occasional sake brewery tour that stops for two minutes.",
    minutes: 25,
    wifi: "None by choice",
    light: "Skylit",
    era: "Pre-1800",
    quiet: "Low murmur",
    seating: "Garden bench",
    drink: "Tea house",
    summary: "A shared well-yard between four sake-brewing households, still in daily communal use.",
    vignette: [
      "Fushimi's brewing district sits on soft groundwater, and before piped supply, blocks of houses shared a single well-yard. Idoba is one of the last still functioning, ringed by four households who maintain it in rotation.",
      "The architecture is humble and precise: a tiled well-head, a stone drainage channel cut with a fall of about one in eighty, and a lean-to whose roof pitch is set to keep rain off the pump but let winter sun onto the washing stones.",
      "It is a courtyard that belongs to nobody in particular, which in Kyoto's dense grid is rare enough to be worth the detour. Fill a bottle; the water is genuinely good.",
    ],
  },
  {
    id: "kamigamo-en",
    name: "Kamigamo Shirokabe",
    localName: "上賀茂 白壁",
    district: "Kamigamo",
    type: "Architectural gem",
    coords: [135.7529, 35.0596],
    address: "39 Kamigamo Motoyama, Kita-ku, Kyoto 603-8047",
    hours: "10:00 – 16:00, Friday to Sunday",
    gallery: [spot2, spot6, spot3],
    crowd: "Rarely more than a dozen people at once, mostly local.",
    minutes: 45,
    wifi: "Trickle",
    light: "Dappled",
    era: "Pre-1800",
    quiet: "Library hush",
    seating: "Floor seating",
    drink: "Tea house",
    summary: "A shake residence from the shrine-priest quarter, with its private canal still running under the floor.",
    vignette: [
      "The shake were hereditary shrine families, and their houses along the Myojin canal form Kyoto's most intact pre-modern residential street. Each plot draws water from the canal through a small sluice, uses it, and returns it downstream — a protocol enforced for centuries by neighbourly pressure rather than law.",
      "Inside, the earthen walls are finished in a pale Kyoto plaster mixed with straw that fluoresces slightly in afternoon light. The joinery is plainer than a merchant house of the same period; priestly restraint was the point.",
      "Sit at the engawa with the shoji open and you will hear the canal before you see it. That sound is the reason the street was laid out this way.",
    ],
  },
  {
    id: "nishiki-ura",
    name: "Ura-Nishiki Stand",
    localName: "裏錦",
    district: "Nishiki",
    type: "Machiya cafe",
    coords: [135.7639, 35.0051],
    address: "223 Higashiuoyacho, Nakagyo-ku, Kyoto 604-8127",
    hours: "07:30 – 15:00, closed Sunday",
    gallery: [spot4, spot3, spot1],
    crowd: "Market traders on a five-minute break, standing, saying almost nothing.",
    minutes: 20,
    wifi: "Trickle",
    light: "Lantern-dim",
    era: "Mid-century",
    quiet: "Convivial",
    seating: "Counter stool",
    drink: "Hand-drip coffee",
    summary: "A two-metre-wide standing coffee stand wedged into a market service alley.",
    vignette: [
      "Nishiki market's back lanes exist for deliveries, and this stand occupies what was once a fishmonger's ice store. The frontage is 2.1 metres. There are four stools and no table.",
      "Its architectural interest is compression: a full working bar, a sink, a roaster vent and a storage loft fitted into a footprint smaller than a parking space, using the same vertical-stacking logic that machiya carpenters applied to lofts above shop fronts.",
      "Order, stand, drink, leave. The whole ritual takes six minutes and is one of the most purely Kyoto things you can do before nine in the morning.",
    ],
  },
  {
    id: "okazaki-hiiro",
    name: "Hiiro Annex",
    localName: "緋色別館",
    district: "Okazaki",
    type: "Architectural gem",
    coords: [135.7826, 35.0135],
    address: "2-1 Okazaki Enshojicho, Sakyo-ku, Kyoto 606-8344",
    hours: "11:00 – 18:00, closed Thursday",
    gallery: [spot6, spot4, spot5],
    crowd: "Gallery-goers crossing from the museums; quietest right after opening.",
    minutes: 40,
    wifi: "Fibre-fast",
    light: "Skylit",
    era: "Contemporary",
    quiet: "Low murmur",
    seating: "Timber table",
    drink: "Tea house",
    summary: "A 1930s civic annex reworked as a tea counter, keeping its terrazzo and its steel windows.",
    vignette: [
      "Okazaki was Kyoto's early-twentieth-century civic showpiece, and this annex served an exhibition hall that no longer exists. Its steel-framed windows and terrazzo floor are imperial-era municipal standard issue, now vanishingly rare.",
      "The reuse is light-handed: a single long counter in blackened steel, no new partitions, and lighting hung from the existing conduit runs. The room's proportions — high, narrow, north-lit — do the work.",
      "They pour hojicha roasted in-house and a sencha cold-brewed overnight. Sit at the north end where the window mullions cast a grid across the terrazzo around three in the afternoon.",
    ],
  },
];

export const spotById = (id: string) => SPOTS.find((s) => s.id === id);
