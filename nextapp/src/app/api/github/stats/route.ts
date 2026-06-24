import { NextResponse } from "next/server";
import { getGitHubStats } from "@/lib/github";

export async function GET() {
  try {
    const stats = await getGitHubStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("API error in /api/github/stats:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
