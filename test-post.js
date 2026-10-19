const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPost() {
  try {
    const body = {
      title: "Test Property",
      price: "AED 1,000,000",
      status: "FOR SALE",
      propertyType: "Residential",
      category: "Apartment",
      city: "Dubai",
      location: "Downtown Dubai",
      beds: 2,
      baths: 2,
      sqft: "1200",
      directionLink: "https://maps.google.com",
      image: "http://example.com/image.jpg",
      overview: "Beautiful apartment",
      specifications: [{ title: "View", desc: "Burj Khalifa" }],
      amenities: [{ title: "Pool", desc: "Infinity pool" }],
      galleryImages: ["http://example.com/image2.jpg"]
    };

    const newListing = await prisma.listing.create({
      data: {
        title: body.title,
        price: body.price,
        location: body.location,
        city: body.city || "Dubai",
        propertyType: body.propertyType || "Residential",
        category: body.category || "Apartment",
        beds: typeof body.beds === 'number' ? body.beds : parseInt(body.beds) || 0,
        baths: typeof body.baths === 'number' ? body.baths : parseInt(body.baths) || 0,
        sqft: String(body.sqft || "0"),
        image: body.image || "",
        status: body.status || "FOR SALE",
        galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        description: body.description || null,
        features: Array.isArray(body.features) ? body.features : [],
        overview: body.overview || null,
        directionLink: body.directionLink || null,
        specifications: body.specifications || [],
        amenities: body.amenities || [],
      }
    });

    console.log("Success!", newListing.id);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

testPost();
