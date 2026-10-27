import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";

// Saves the developer order from the admin list: each id gets its position as `order`
export async function PUT(request: Request) {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ success: false, error: "ids must be a list of developer ids" }, { status: 400 });
    }

    await Promise.all(
      ids.map((id: string, order: number) => prisma.developer.update({ where: { id }, data: { order } }))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering developers:", error);
    return NextResponse.json({ success: false, error: "Failed to save the new order" }, { status: 500 });
  }
}
