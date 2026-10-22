import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";
import { slugify } from "@/lib/listingStatus";

const isObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

// Accepts either the developer's id or its slug, so public pages can use pretty URLs
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const developer = isObjectId(id)
      ? await prisma.developer.findUnique({ where: { id } })
      : await prisma.developer.findUnique({ where: { slug: id } });

    if (!developer || developer.isVisible === false) {
      return NextResponse.json({ success: false, error: "Developer not found" }, { status: 404 });
    }

    const listings = await prisma.listing.findMany({
      where: { developerId: developer.id, NOT: { isVisible: false } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: { ...developer, listings } });
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch developer" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const data: any = {};
    if (body.name !== undefined) data.name = String(body.name);
    if (body.logo !== undefined) data.logo = String(body.logo);
    if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.website !== undefined) data.website = body.website || null;
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.isVisible !== undefined) data.isVisible = Boolean(body.isVisible);
    if (body.slug) {
      const slug = slugify(body.slug);
      const clash = await prisma.developer.findUnique({ where: { slug } });
      if (clash && clash.id !== id) {
        return NextResponse.json({ success: false, error: "Another developer already uses this URL slug" }, { status: 400 });
      }
      data.slug = slug;
    }

    const developer = await prisma.developer.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    console.error("Error updating developer:", error);
    return NextResponse.json({ success: false, error: "Failed to update developer" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Unlink the developer's listings so they keep working as normal off plan listings
    await prisma.listing.updateMany({ where: { developerId: id }, data: { developerId: null } });
    await prisma.developer.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Developer deleted successfully" });
  } catch (error) {
    console.error("Error deleting developer:", error);
    return NextResponse.json({ success: false, error: "Failed to delete developer" }, { status: 500 });
  }
}
