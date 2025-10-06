import { NextResponse } from "next/server";
import { getRationales } from "@/lib/get-rationales";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const govActionId = decodeURIComponent(id);
    const data = await getRationales(govActionId); // { rationales: [{ choice, rationale }] }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load rationales" },
      { status: 500 }
    );
  }
}