import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, page, subpage, category, order } = body;

    // Determine target category slug if page/subpage changed
    let finalCategory = category;
    if (!finalCategory) {
      if (page === "Home") finalCategory = "general";
      else if (page === "Buy") finalCategory = "buy";
      else if (page === "Sell") finalCategory = "sell";
      else if (page === "Rent") finalCategory = "rent";
      else if (page === "Invest") finalCategory = "invest";
      else if (page === "Property Details") finalCategory = "property";
      else if (page === "Property Services" && subpage) {
        const slugMap: Record<string, string> = {
          "Mortgage Advisory": "mortgage-services",
          "Relocation Services": "relocation-services",
          "Property Management": "property-management",
          "Property Brokerage": "property-brokerage",
          "Commercial Advisory": "commercial-services",
          "Industrial Services": "industrial-services",
          "Interior Design & Fit-Out": "interior-design-and-fit-out",
          "Real Estate Development": "real-estate-development",
        };
        finalCategory = slugMap[subpage] || "services";
      }
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        ...(question && { question: question.trim() }),
        ...(answer && { answer: answer.trim() }),
        ...(page && { page }),
        subpage: page === "Property Services" ? (subpage || null) : null,
        ...(finalCategory && { category: finalCategory }),
        ...(typeof order === "number" && { order }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.faq.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
