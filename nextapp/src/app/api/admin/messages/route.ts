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

    // 2. Fetch messages from database
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, data: [] });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error("API error in /api/admin/messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load messages" },
      { status: 500 }
    );
  }
}
