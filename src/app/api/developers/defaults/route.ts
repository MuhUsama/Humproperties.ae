import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSessionFromCookies } from "@/lib/adminAuth";
import { DEFAULT_DEVELOPERS } from "@/lib/defaultDevelopers";

// Adds any default developer that isn't in the database yet (matched by slug), leaving existing ones untouched
export async function POST() {
  const { authenticated } = await checkAdminSessionFromCookies();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.developer.findMany({ select: { slug: true } });
    const existingSlugs = new Set(existing.map((d) => d.slug));
    const missing = DEFAULT_DEVELOPERS.filter((d) => !existingSlugs.has(d.slug));

    for (const dev of missing) {
      await prisma.developer.create({ data: { ...dev, isVisible: true } });
    }

    return NextResponse.json({ success: true, added: missing.length });
  } catch (error) {
    console.error("Error adding default developers:", error);
    return NextResponse.json({ success: false, error: "Failed to add default developers" }, { status: 500 });
  }
}
