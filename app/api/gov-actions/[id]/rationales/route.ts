import { NextResponse } from "next/server";
import { getRationales } from "@/lib/get-rationales";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const govActionId = decodeURIComponent(params.id);
    const data = await getRationales(govActionId); // { rationales: [{ choice, rationale }] }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load rationales" },
      { status: 500 }
    );
  }
}