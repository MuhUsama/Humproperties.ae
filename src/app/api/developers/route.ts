import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";
import { slugify } from "@/lib/listingStatus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    const developers = await prisma.developer.findMany({
      where: includeAll ? {} : { NOT: { isVisible: false } },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, data: developers });
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch developers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, logo, coverImage, description, website, order, isVisible } = body;

    if (!name || !logo) {
      return NextResponse.json({ success: false, error: "Name and logo are required" }, { status: 400 });
    }

    const baseSlug = slugify(body.slug || name) || "developer";
    let slug = baseSlug;
    for (let i = 2; await prisma.developer.findUnique({ where: { slug } }); i++) {
      slug = `${baseSlug}-${i}`;
    }

    const developer = await prisma.developer.create({
      data: {
        name,
        slug,
        logo,
        coverImage: coverImage || null,
        description: description || null,
        website: website || null,
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    console.error("Error creating developer:", error);
    return NextResponse.json({ success: false, error: "Failed to create developer" }, { status: 500 });
  }
}
