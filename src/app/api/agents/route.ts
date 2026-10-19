import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, image, phone, email, whatsapp, languages } = body;

    if (!name || !role || !image) {
      return NextResponse.json({ success: false, error: "Name, role, and image are required" }, { status: 400 });
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        role,
        image,
        phone,
        email,
        whatsapp,
        languages: languages || [],
      }
    });

    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 });
  }
}
