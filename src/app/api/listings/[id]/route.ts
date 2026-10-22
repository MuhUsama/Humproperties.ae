import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { unitDetailsFromBody } from "@/lib/unitDetails";

const prisma = new PrismaClient();

const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);

if (match) {
  cloudinary.config({
    api_key: match[1],
    api_secret: match[2],
    cloud_name: match[3],
    secure: true,
  });
} else {
  cloudinary.config({
    secure: true,
  });
}

function getCloudinaryPublicId(url: string) {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const nameWithoutExt = filename.split('.')[0];
    return `${folder}/${nameWithoutExt}`;
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const listing = await prisma.listing.findUnique({
      where: { id: params.id }
    });
    
    if (!listing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    if (listing.isVisible === false && !isAdmin) {
      return NextResponse.json({ success: false, error: "Listing is not available" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch listing" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const params = await context.params;
    const deletedListing = await prisma.listing.delete({
      where: { id: params.id }
    });

    // Delete associated images from Cloudinary
    const imageUrls = [deletedListing.image, ...(deletedListing.galleryImages || [])];
    for (const url of imageUrls) {
      const publicId = url ? getCloudinaryPublicId(url) : null;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(console.error);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ success: false, error: "Failed to delete listing" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title: body.title,
        price: body.price,
        location: body.location,
        city: body.city,
        propertyType: body.propertyType,
        category: body.category,
        beds: typeof body.beds === 'number' ? body.beds : parseInt(body.beds),
        baths: typeof body.baths === 'number' ? body.baths : parseInt(body.baths),
        sqft: body.sqft !== undefined ? String(body.sqft) : undefined,
        image: body.image,
        status: body.status,
        developerId: body.developerId !== undefined ? body.developerId || null : undefined,
        galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : undefined,
        description: body.description,
        features: Array.isArray(body.features) ? body.features : undefined,
        overview: body.overview !== undefined ? body.overview || null : undefined,
        directionLink: body.directionLink !== undefined ? body.directionLink || null : undefined,
        specifications: Array.isArray(body.specifications) ? body.specifications : undefined,
        amenities: Array.isArray(body.amenities) ? body.amenities : undefined,
        ...unitDetailsFromBody(body, true),
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : undefined,
      }
    });
    
    return NextResponse.json({ success: true, data: updatedListing });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update listing" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.isVisible !== undefined) updateData.isVisible = Boolean(body.isVisible);
    if (body.status !== undefined) updateData.status = String(body.status);
    
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: updateData
    });
    
    return NextResponse.json({ success: true, data: updatedListing });
  } catch (error: any) {
    console.error("Error patching listing:", error);
    return NextResponse.json({ success: false, error: "Failed to update listing: " + (error?.message || error) }, { status: 500 });
  }
}
