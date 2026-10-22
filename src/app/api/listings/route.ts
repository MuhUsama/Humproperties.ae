import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true" || searchParams.get("admin") === "true";

    const where = includeAll ? {} : { NOT: { isVisible: false } };

    const data = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Database GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
        developerId: body.developerId || null,
        galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        description: body.description || null,
        features: Array.isArray(body.features) ? body.features : [],
        overview: body.overview || null,
        directionLink: body.directionLink || null,
        specifications: body.specifications || [],
        amenities: body.amenities || [],
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      }
    });
    
    return NextResponse.json({ success: true, data: newListing });
  } catch (error: any) {
    console.error("Database POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to save listing: " + (error.message || String(error)),
      stack: error.stack
    }, { status: 500 });
  }
}
