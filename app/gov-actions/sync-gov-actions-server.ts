"use server";

import { revalidatePath } from "next/cache";
import {
  syncGovActionTitles,
  updateAllProposals,
  updateExpiredProposals,
  updateProposalAsVoted,
} from "@/lib/sync-gov-actions";

interface UpdateResult {
  success: boolean;
  message: string;
  timestamp: Date;
  errors?: string[];
}

export async function runGovActionsUpdate(): Promise<UpdateResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  try {
    console.log('Starting governance actions update...');
    
    // Run updates sequentially to avoid overwhelming the API
    try {
      await updateAllProposals();
      console.log('✓ Updated all proposals');
    } catch (error) {
      const errorMsg = `Failed to update all proposals: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    try {
      await updateExpiredProposals();
      console.log('✓ Updated expired proposals');
    } catch (error) {
      const errorMsg = `Failed to update expired proposals: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    try {
      await updateProposalAsVoted();
      console.log('✓ Updated voted proposals');
    } catch (error) {
      const errorMsg = `Failed to update voted proposals: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    try {
      await syncGovActionTitles();
    console.log('✓ Synced governance action titles');
    } catch (error) {
      const errorMsg = `Failed to sync governance action titles: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    // Revalidate cache
    revalidatePath("/gov-actions");
    revalidatePath("/gov-actions/[id]", "page");
    
    const duration = Date.now() - startTime;
    console.log(`Governance actions update completed in ${duration}ms`);
    
    if (errors.length > 0) {
      return {
        success: false,
        message: `Update completed with ${errors.length} error(s)`,
        timestamp: new Date(),
        errors
      };
    }
    
    return {
      success: true,
      message: 'All governance actions updated successfully',
      timestamp: new Date()
    };
    
  } catch (error) {
    const errorMsg = `Critical error during governance actions update: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    
    return {
      success: false,
      message: 'Update failed due to critical error',
      timestamp: new Date(),
      errors: [errorMsg]
    };
  }
}
