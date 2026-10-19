import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Database GET Error (Blogs):", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, image, author, published } = body;

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || null,
        author: author || "Mohd. Alfalasi",
        published: published ?? true,
      }
    });

    return NextResponse.json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
