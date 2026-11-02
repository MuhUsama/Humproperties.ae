import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";
import { slugify } from "@/lib/listingStatus";
import { isObjectId, projectFieldsFromBody } from "@/lib/offPlanProjects";

// Accepts the project's id or its slug. Returns the project with its developer and visible listings.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = isObjectId(id)
      ? await prisma.offPlanProject.findUnique({ where: { id } })
      : await prisma.offPlanProject.findUnique({ where: { slug: id } });

    if (!project || project.isVisible === false) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const [developer, listings] = await Promise.all([
      prisma.developer.findUnique({ where: { id: project.developerId } }),
      prisma.listing.findMany({
        where: { projectId: project.id, NOT: { isVisible: false } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!developer || developer.isVisible === false) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...project, developer, listings } });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 });
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

    const data: any = projectFieldsFromBody(body, true);
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.developerId !== undefined) data.developerId = String(body.developerId);
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.isVisible !== undefined) data.isVisible = Boolean(body.isVisible);
    if (body.slug) {
      const slug = slugify(body.slug);
      const clash = await prisma.offPlanProject.findUnique({ where: { slug } });
      if (clash && clash.id !== id) {
        return NextResponse.json({ success: false, error: "Another project already uses this URL slug" }, { status: 400 });
      }
      data.slug = slug;
    }

    const project = await prisma.offPlanProject.update({ where: { id }, data });

    // Keep the project's listings under the same developer as the project
    if (data.developerId) {
      await prisma.listing.updateMany({ where: { projectId: id }, data: { developerId: data.developerId } });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
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
    // Listings stay on the site, still under the developer, just not inside a project
    await prisma.listing.updateMany({ where: { projectId: id }, data: { projectId: null } });
    await prisma.offPlanProject.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
