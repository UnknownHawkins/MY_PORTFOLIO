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

    // 2. Fetch projects from database (or return empty list if not connected)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, data: [] });
    }

    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    console.error("API error in /api/admin/projects:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load projects" },
      { status: 500 }
    );
  }
}
