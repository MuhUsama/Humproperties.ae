import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";
import { slugify } from "@/lib/listingStatus";
import { projectFieldsFromBody } from "@/lib/offPlanProjects";

// GET /api/projects            visible projects (public)
// GET /api/projects?all=true   every project (admin)
// GET /api/projects?developerId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";
    const developerId = searchParams.get("developerId");

    const where: any = includeAll ? {} : { NOT: { isVisible: false } };
    if (developerId) where.developerId = developerId;

    const projects = await prisma.offPlanProject.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const developerId = String(body.developerId || "");

    if (!name || !developerId) {
      return NextResponse.json({ success: false, error: "Project name and developer are required" }, { status: 400 });
    }

    const baseSlug = slugify(body.slug || name) || "project";
    let slug = baseSlug;
    for (let i = 2; await prisma.offPlanProject.findUnique({ where: { slug } }); i++) {
      slug = `${baseSlug}-${i}`;
    }

    const project = await prisma.offPlanProject.create({
      data: {
        name,
        slug,
        developerId,
        ...projectFieldsFromBody(body),
        order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      } as any,
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
