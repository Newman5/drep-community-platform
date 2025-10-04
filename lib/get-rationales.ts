"use server";

import prisma from "@/lib/prisma";

export async function getRationales(govActionId: string) {
  try {
    const rationales = await prisma.vote.findMany({
      where: { govActionId, rationale: { not: null } },
      select: { rationale: true, choice: true },
    });

    return {
      rationales, // [{ rationale, choice }]
    };
  } catch (e) {
    console.error("[getRationales] error", e);
    throw new Error("Failed to load rationales");
  }
}