import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";

// Sample projects and properties so the admin can preview the off plan pages before adding real ones.
// Every sample project's slug starts with "sample-", which is how DELETE finds and removes them all again.

const SAMPLE_PREFIX = "sample-";
const COVERS = ["emaar", "meraas", "dubai-properties", "meydan", "modon", "sobha", "nakheel", "damac", "aldar", "ellington", "mered", "rak-properties"].map(
  (slug) => `/developers/${slug}-cover.jpg`
);
const cover = (i: number) => COVERS[i % COVERS.length];
const gallery = (i: number) => [1, 2, 3, 4, 5].map((n) => cover(i + n));

const SAMPLE_PROJECTS: Record<string, { name: string; location: string; propertyTypes: string; bedrooms: string; startingPrice: string; price: number; handover: string; discount?: string; description: string }[]> = {
  reportage: [
    { name: "Verdana Apartments", location: "DIP, Dubai", propertyTypes: "Apartments", bedrooms: "Studio to 4 Bedroom", startingPrice: "AED 550K", price: 550000, handover: "2028", discount: "Up to 15%", description: "Contemporary apartments in Dubai Investments Park with resort-style amenities, landscaped podiums and easy access to Al Maktoum Airport and Expo City." },
    { name: "Verdana Townhouses", location: "DIP, Dubai", propertyTypes: "Townhouses", bedrooms: "2 to 4 Bedroom", startingPrice: "AED 1.4M", price: 1400000, handover: "2028", description: "Family townhouses with private gardens, community parks and a clubhouse, a short drive from Dubai South." },
    { name: "Taormina Village", location: "Arjan, Dubai", propertyTypes: "Townhouses", bedrooms: "3 to 4 Bedroom", startingPrice: "AED 1.9M", price: 1900000, handover: "2029", discount: "Up to 10%", description: "A Sicilian-inspired gated village of townhouses around piazzas, pools and green walkways." },
  ],
  emaar: [
    { name: "Creek Waters", location: "Dubai Creek Harbour", propertyTypes: "Apartments", bedrooms: "1 to 3 Bedroom", startingPrice: "AED 1.6M", price: 1600000, handover: "2028", description: "Waterfront towers on the Creek with views of the Dubai skyline, a private beach and direct access to the Creek Marina." },
    { name: "Golf Hillside", location: "Dubai Hills Estate", propertyTypes: "Apartments", bedrooms: "1 to 3 Bedroom", startingPrice: "AED 2.1M", price: 2100000, handover: "2027", description: "Apartments overlooking the Dubai Hills championship golf course, minutes from Dubai Hills Mall." },
    { name: "The Valley Villas", location: "The Valley, Dubai", propertyTypes: "Villas", bedrooms: "3 to 5 Bedroom", startingPrice: "AED 3.4M", price: 3400000, handover: "2029", description: "Spacious villas in a green, family-focused community along the Dubai–Al Ain road." },
  ],
  binghatti: [
    { name: "Binghatti Skyrise", location: "Business Bay, Dubai", propertyTypes: "Apartments", bedrooms: "Studio to 3 Bedroom", startingPrice: "AED 1.1M", price: 1100000, handover: "2027", discount: "5% off", description: "Three towers on the Dubai Canal with signature Binghatti architecture and a rooftop pool deck." },
    { name: "Binghatti Hills", location: "Al Barsha South, Dubai", propertyTypes: "Apartments", bedrooms: "Studio to 2 Bedroom", startingPrice: "AED 900K", price: 900000, handover: "2027", description: "Affordable apartments in a quiet community close to Arjan and Dubai Miracle Garden." },
  ],
  sobha: [
    { name: "Sobha Hartland II", location: "MBR City, Dubai", propertyTypes: "Apartments", bedrooms: "1 to 4 Bedroom", startingPrice: "AED 1.8M", price: 1800000, handover: "2028", description: "Lagoon-front residences in a gated forest community close to Downtown Dubai." },
  ],
};

const UNITS = [
  { type: "1 Bedroom Apartment", beds: 1, baths: 2, sqft: 760, factor: 1 },
  { type: "2 Bedroom Apartment", beds: 2, baths: 3, sqft: 1180, factor: 1.45 },
  { type: "3 Bedroom Residence", beds: 3, baths: 4, sqft: 1720, factor: 2.05 },
];

export async function POST() {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const developers = await prisma.developer.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    if (developers.length === 0) {
      return NextResponse.json({ success: false, error: "Add a developer first (or click Add Default Developers)" }, { status: 400 });
    }

    // Use the developers the samples were written for; fall back to the first developers in the list
    let targets = developers.filter((d) => SAMPLE_PROJECTS[d.slug]);
    const pool = Object.values(SAMPLE_PROJECTS);
    const plan = targets.length
      ? targets.map((d) => ({ dev: d, projects: SAMPLE_PROJECTS[d.slug] }))
      : (targets = developers.slice(0, 3)).map((d, i) => ({ dev: d, projects: pool[i % pool.length] }));

    let projectsAdded = 0;
    let listingsAdded = 0;
    let n = 0;

    for (const { dev, projects } of plan) {
      for (const [order, sample] of projects.entries()) {
        n++;
        const slug = `${SAMPLE_PREFIX}${dev.slug}-${sample.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        if (await prisma.offPlanProject.findUnique({ where: { slug } })) continue;

        const project = await prisma.offPlanProject.create({
          data: {
            name: sample.name,
            slug,
            developerId: dev.id,
            coverImage: cover(n),
            galleryImages: gallery(n),
            location: sample.location,
            propertyTypes: sample.propertyTypes,
            bedrooms: sample.bedrooms,
            startingPrice: sample.startingPrice,
            handover: sample.handover,
            discount: sample.discount || null,
            description: sample.description,
            order,
            isVisible: true,
          },
        });
        projectsAdded++;

        for (const [u, unit] of UNITS.entries()) {
          const price = Math.round((sample.price * unit.factor) / 5000) * 5000;
          await prisma.listing.create({
            data: {
              title: `${unit.type}, ${sample.name}`,
              price: price.toLocaleString("en-US"),
              location: sample.location.replace(/, Dubai$/, ""),
              city: "Dubai",
              propertyType: "Residential",
              category: "Apartment",
              beds: unit.beds,
              baths: unit.baths,
              sqft: String(unit.sqft),
              image: cover(n + u + 1),
              status: "OFF PLAN",
              developerId: dev.id,
              projectId: project.id,
              galleryImages: gallery(n + u),
              description: `Sample property in ${sample.name} by ${dev.name}. Remove it from Admin > Off Plan Projects > Remove Samples.`,
              features: [],
              specifications: [],
              amenities: [],
              isVisible: true,
            },
          });
          listingsAdded++;
        }
      }
    }

    return NextResponse.json({ success: true, projectsAdded, listingsAdded });
  } catch (error) {
    console.error("Error adding sample projects:", error);
    return NextResponse.json({ success: false, error: "Failed to add sample projects" }, { status: 500 });
  }
}

export async function DELETE() {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const samples = await prisma.offPlanProject.findMany({ where: { slug: { startsWith: SAMPLE_PREFIX } }, select: { id: true } });
    const ids = samples.map((p) => p.id);
    const listings = await prisma.listing.deleteMany({ where: { projectId: { in: ids }, description: { startsWith: "Sample property in " } } });
    // Any real property someone linked to a sample project stays, just unlinked
    await prisma.listing.updateMany({ where: { projectId: { in: ids } }, data: { projectId: null } });
    const projects = await prisma.offPlanProject.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true, projectsRemoved: projects.count, listingsRemoved: listings.count });
  } catch (error) {
    console.error("Error removing sample projects:", error);
    return NextResponse.json({ success: false, error: "Failed to remove sample projects" }, { status: 500 });
  }
}
