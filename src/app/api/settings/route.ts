import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await prisma.setting.findUnique({
        where: { key }
      });
      return NextResponse.json({ value: setting?.value || null }, { status: 200 });
    }

    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.settings && typeof body.settings === "object") {
      const results = [];
      for (const [key, val] of Object.entries(body.settings)) {
        const s = await prisma.setting.upsert({
          where: { key },
          update: { value: String(val) },
          create: { key, value: String(val) }
        });
        results.push(s);
      }
      try {
        revalidatePath("/", "layout");
      } catch (e) {
        // ignore cache revalidate error
      }
      return NextResponse.json({ success: true, count: results.length, data: results }, { status: 200 });
    }

    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      // ignore
    }

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
