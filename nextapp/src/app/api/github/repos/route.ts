import { NextResponse } from "next/server";
import { getRepositories } from "@/lib/github";

export async function GET() {
  try {
    const repos = await getRepositories();
    return NextResponse.json({ success: true, data: repos });
  } catch (error: any) {
    console.error("API error in /api/github/repos:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch GitHub repositories" },
      { status: 500 }
    );
  }
}
