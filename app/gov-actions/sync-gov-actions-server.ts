// app/gov-actions/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  updateAllProposals,
  updateExpiredProposals,
  updateProposalAsVoted,
} from "@/lib/sync-gov-actions";

export async function runGovActionsUpdate() {
  await updateAllProposals();
  await updateExpiredProposals();
  await updateProposalAsVoted();

  // tell Next.js to re-fetch fresh data for this page
  revalidatePath("/gov-actions");
}
