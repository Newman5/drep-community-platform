import { cache } from "react";
import { prisma } from "./prisma";
import type { GovActionType } from "@prisma/client";

export interface GovActionWithResults {
  id: string;
  title: string | null;
  category: string;
  votingDeadline: string;
  currentResults: {
    yes: number;
    no: number;
    abstain: number;
    totalVotes: number;
  };
  daysRemaining: number;
}

// Cache the expensive database query
export const getVotePendingGovActions = cache(async (): Promise<GovActionWithResults[]> => {
  try {
    // Use a more efficient query with pagination potential
    const govActions = await prisma.govAction.findMany({
      where: {
        expired: false,
        voted: false,
      },
      include: {
        votes: {
          select: {
            choice: true, // Only select what we need
            // Don't include full vote data to reduce payload
          }
        },
      },
      orderBy: [
        { votingDeadline: 'asc' }, // Most urgent first
        { id: 'desc' } // Then by ID for consistent ordering
      ],
      // Add pagination for large datasets
      take: 100, // Limit to 100 proposals max
    });

    if (!govActions || govActions.length === 0) {
      console.log("No pending governance actions found");
      return [];
    }

    const results = govActions.map((govAction) => {
      try {
        // Calculate vote results more efficiently
        const votes = govAction.votes;
        const totalVotes = votes.length;
        
        // Use reduce for better performance with large vote counts
        const voteCounts = votes.reduce(
          (acc, vote) => {
            switch (vote.choice) {
              case "YES":
                acc.yes++;
                break;
              case "NO":
                acc.no++;
                break;
              case "ABSTAIN":
                acc.abstain++;
                break;
            }
            return acc;
          },
          { yes: 0, no: 0, abstain: 0 }
        );

        // Calculate percentages with safer division
        const yesPercentage = totalVotes > 0 ? Math.round((voteCounts.yes / totalVotes) * 100) : 0;
        const noPercentage = totalVotes > 0 ? Math.round((voteCounts.no / totalVotes) * 100) : 0;
        const abstainPercentage = totalVotes > 0 ? Math.round((voteCounts.abstain / totalVotes) * 100) : 0;

        // Calculate days remaining with better error handling
        const now = new Date();
        const deadline = new Date(govAction.votingDeadline);
        
        // Validate deadline date
        if (isNaN(deadline.getTime())) {
          console.warn(`Invalid voting deadline for governance action ${govAction.id}`);
          return null; // Will be filtered out
        }
        
        const timeDiff = deadline.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        return {
          id: govAction.id,
          title: govAction.title || null,
          category: formatCategoryName(govAction.category),
          votingDeadline: govAction.votingDeadline.toISOString().split("T")[0],
          currentResults: {
            yes: yesPercentage,
            no: noPercentage,
            abstain: abstainPercentage,
            totalVotes: totalVotes,
          },
          daysRemaining: daysRemaining,
        };
      } catch (itemError) {
        console.error(`Error processing governance action ${govAction.id}:`, itemError);
        return null; // Will be filtered out
      }
    });

    // Filter out any null results from processing errors
    const validResults = results.filter((result): result is GovActionWithResults => result !== null);
    
    console.log(`Successfully processed ${validResults.length} governance actions`);
    return validResults;
    
  } catch (error) {
    console.error("Error fetching gov actions:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        throw new Error("Database connection failed. Please try again later.");
      } else if (error.message.includes('timeout')) {
        throw new Error("Request timed out. Please try again.");
      }
    }
    
    throw new Error("Failed to fetch governance actions. Please try again later.");
  }
});

function formatCategoryName(category: GovActionType): string {
  const categoryMap: Record<GovActionType, string> = {
    info_action: "Info Action",
    parameter_change: "Parameter Change", 
    treasury_withdrawals: "Treasury Withdrawals",
    hard_fork_initiation: "Hard Fork Initiation",
    new_committee: "New Committee",
    new_constitution: "New Constitution",
    no_confidence: "No Confidence",
  };
  
  return categoryMap[category] || category;
}
