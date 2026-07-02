import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // 1. Session check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Fetch blogs from database
    if (!process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ success: true, data: [] });
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    console.error("API error in /api/admin/blogs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load blogs" },
      { status: 500 }
    );
  }
}
