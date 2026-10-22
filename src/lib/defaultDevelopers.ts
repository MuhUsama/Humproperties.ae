// Developers featured on the Off Plan page by default (matching the line-up on kamaniliving.com/off-plan).
// Admins add them with one click from /admin/developers and can edit, hide or delete them afterwards.
// Logos and covers live in /public/developers.
const LOGO_EXT: Record<string, "svg" | "png"> = {
  aldar: "png",
  binghatti: "svg",
  damac: "svg",
  "dubai-properties": "svg",
  ellington: "png",
  emaar: "svg",
  meraas: "svg",
  mered: "svg",
  meydan: "svg",
  modon: "svg",
  nakheel: "svg",
  "rak-properties": "svg",
  sobha: "svg",
};

export const DEFAULT_DEVELOPERS = [
  {
    slug: "emaar",
    name: "Emaar Properties",
    website: "https://www.emaar.com",
    description: "The developer behind Burj Khalifa, Downtown Dubai, Dubai Hills Estate and Dubai Creek Harbour. Emaar has delivered more than 100,000 homes across the UAE and is known for master-planned communities with strong long-term demand.",
  },
  {
    slug: "damac",
    name: "DAMAC Properties",
    website: "https://www.damacproperties.com",
    description: "One of Dubai's largest private developers, known for branded luxury residences and large communities such as DAMAC Hills, DAMAC Lagoons and Cavalli Tower, often with flexible payment plans.",
  },
  {
    slug: "meraas",
    name: "Meraas",
    website: "https://www.meraas.com",
    description: "Part of Dubai Holding, Meraas creates lifestyle destinations including Bluewaters, City Walk, La Mer and Jumeirah Bay, with design-led waterfront and urban residences.",
  },
  {
    slug: "binghatti",
    name: "Binghatti",
    website: "https://www.binghatti.com",
    description: "A design-driven developer recognised for its distinctive architecture and fast delivery, with projects across Business Bay, Jumeirah Village Circle and the Burj Binghatti Jacob & Co Residences.",
  },
  {
    slug: "sobha",
    name: "Sobha Realty",
    website: "https://www.sobharealty.com",
    description: "A backward-integrated developer that designs and builds in-house, known for build quality at Sobha Hartland, Sobha Hartland II and Sobha One along the Ras Al Khor wildlife sanctuary.",
  },
  {
    slug: "nakheel",
    name: "Nakheel",
    website: "https://www.nakheel.com",
    description: "The master developer behind Palm Jumeirah, Palm Jebel Ali and Dubai Islands, shaping much of Dubai's iconic coastline and waterfront living.",
  },
  {
    slug: "ellington",
    name: "Ellington Properties",
    website: "https://www.ellingtonproperties.ae",
    description: "A boutique developer focused on design and craftsmanship, with refined residences in Downtown, Dubai Hills, Mohammed Bin Rashid City and Jumeirah Village Circle.",
  },
  {
    slug: "dubai-properties",
    name: "Dubai Properties",
    website: "https://www.dp.ae",
    description: "Part of Dubai Holding, Dubai Properties developed Jumeirah Beach Residence, Business Bay and Mudon, and continues to launch family communities across the city.",
  },
  {
    slug: "meydan",
    name: "Meydan",
    website: "https://www.meydan.ae",
    description: "Developer of the Meydan district and Mohammed Bin Rashid City's District One, combining green landscapes, crystal lagoons and close access to Downtown Dubai.",
  },
  {
    slug: "rak-properties",
    name: "RAK Properties",
    website: "https://www.rakproperties.ae",
    description: "A leading Ras Al Khaimah developer behind Mina Al Arab and Hayat Island, offering waterfront homes in one of the UAE's fastest-growing destinations.",
  },
  {
    slug: "aldar",
    name: "Aldar Properties",
    website: "https://www.aldar.com",
    description: "Abu Dhabi's largest developer, behind Yas Island, Saadiyat Island and Al Raha Beach, and increasingly active in Dubai with large master-planned communities.",
  },
  {
    slug: "modon",
    name: "Modon Properties",
    website: "https://www.modon.ae",
    description: "An Abu Dhabi developer creating waterfront and island communities such as Al Hudayriyat Island, with a focus on lifestyle, sport and nature.",
  },
  {
    slug: "mered",
    name: "Mered",
    website: "https://www.mered.ae",
    description: "A luxury developer creating high-end waterfront residences in Dubai, including landmark towers on Dubai Harbour and Palm Jumeirah.",
  },
].map((dev, order) => ({
  ...dev,
  logo: `/developers/${dev.slug}-logo.${LOGO_EXT[dev.slug] || "png"}`,
  coverImage: `/developers/${dev.slug}-cover.jpg`,
  order,
}));
