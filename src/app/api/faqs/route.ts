import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { faqData } from "@/lib/faqData";

// Helper to determine page and subpage from category
function mapCategoryToPageInfo(category: string): { page: string; subpage: string | null } {
  switch (category) {
    case "general":
      return { page: "Home", subpage: null };
    case "buy":
      return { page: "Buy", subpage: null };
    case "sell":
      return { page: "Sell", subpage: null };
    case "rent":
      return { page: "Rent", subpage: null };
    case "invest":
      return { page: "Invest", subpage: null };
    case "property":
      return { page: "Property Details", subpage: null };
    case "mortgage-services":
      return { page: "Property Services", subpage: "Mortgage Advisory" };
    case "relocation-services":
      return { page: "Property Services", subpage: "Relocation Services" };
    case "property-management":
      return { page: "Property Services", subpage: "Property Management" };
    case "property-brokerage":
      return { page: "Property Services", subpage: "Property Brokerage" };
    case "commercial-services":
      return { page: "Property Services", subpage: "Commercial Advisory" };
    case "industrial-services":
      return { page: "Property Services", subpage: "Industrial Services" };
    case "interior-design-and-fit-out":
      return { page: "Property Services", subpage: "Interior Design & Fit-Out" };
    case "real-estate-development":
      return { page: "Property Services", subpage: "Real Estate Development" };
    default:
      return { page: "Other", subpage: null };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = searchParams.get("page");
    const subpage = searchParams.get("subpage");
    const includeAll = searchParams.get("all") === "true";

    // Auto-seed if Faq collection is empty
    const count = await prisma.faq.count();
    if (count === 0 && faqData.length > 0) {
      console.log("Seeding initial FAQs from faqData into database...");
      const seedItems = faqData.map((item, index) => {
        const info = mapCategoryToPageInfo(item.category);
        return {
          question: item.question,
          answer: item.answer,
          category: item.category,
          page: info.page,
          subpage: info.subpage,
          order: index,
        };
      });

      // Insert all
      for (const item of seedItems) {
        await prisma.faq.create({ data: item });
      }
    }

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (page && page !== "All Pages") {
      where.page = page;
    }
    if (subpage && subpage !== "All Subpages") {
      where.subpage = subpage;
    }

    const data = await prisma.faq.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/faqs Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, page, subpage, category, order } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { success: false, error: "Answer is required" },
        { status: 400 }
      );
    }

    // Determine target category slug if not provided
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
      } else {
        finalCategory = "general";
      }
    }

    const newFaq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        page: page || "Home",
        subpage: subpage || null,
        category: finalCategory,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json({ success: true, data: newFaq });
  } catch (error: any) {
    console.error("POST /api/faqs Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create FAQ: " + error.message },
      { status: 500 }
    );
  }
}
