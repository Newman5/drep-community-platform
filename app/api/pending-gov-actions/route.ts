import { getPendingProposals } from "@/lib/data-manipulation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingProposals = await getPendingProposals();

    return NextResponse.json(
      { pendingProposals: pendingProposals },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch pending proposals" },
      { status: 500 }
    );
  }
}
