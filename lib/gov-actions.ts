import { prisma } from "./prisma";
import type { GovActionType, GovAction, Vote } from "@prisma/client";

export interface GovActionWithResults {
  id: string;
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

type GovActionWithVotes = GovAction & {
  votes: Vote[];
};

export async function getAllGovActions(): Promise<GovActionWithResults[]> {
  try {
    const govActions = await prisma.govAction.findMany({
      include: {
        votes: true,
      },
    });

    return govActions.map((govAction: GovActionWithVotes) => {
      // Calculate vote results
      const totalVotes = govAction.votes.length;
      const yesVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "YES"
      ).length;
      const noVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "NO"
      ).length;
      const abstainVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "ABSTAIN"
      ).length;

      // Calculate percentages
      const yesPercentage =
        totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
      const noPercentage =
        totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
      const abstainPercentage =
        totalVotes > 0 ? Math.round((abstainVotes / totalVotes) * 100) : 0;

      // Calculate days remaining
      const now = new Date();
      const deadline = new Date(govAction.votingDeadline);
      const timeDiff = deadline.getTime() - now.getTime();
      const daysRemaining = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      );

      return {
        id: govAction.id,
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
    });
  } catch (error) {
    console.error("Error fetching gov actions:", error);
    throw new Error("Failed to fetch gov actions");
  }
}

export async function getActiveGovActions(): Promise<GovActionWithResults[]> {
    try {
    const govActions = await prisma.govAction.findMany({
      where: {
        expired: false,
        voted: false,
      },
      include: {
        votes: true,
      },
    });

    return govActions.map((govAction: GovActionWithVotes) => {
      // Calculate vote results
      const totalVotes = govAction.votes.length;
      const yesVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "YES"
      ).length;
      const noVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "NO"
      ).length;
      const abstainVotes = govAction.votes.filter(
        (vote: Vote) => vote.choice === "ABSTAIN"
      ).length;

      // Calculate percentages
      const yesPercentage =
        totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
      const noPercentage =
        totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
      const abstainPercentage =
        totalVotes > 0 ? Math.round((abstainVotes / totalVotes) * 100) : 0;

      // Calculate days remaining
      const now = new Date();
      const deadline = new Date(govAction.votingDeadline);
      const timeDiff = deadline.getTime() - now.getTime();
      const daysRemaining = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      );

      return {
        id: govAction.id,
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
    });
  } catch (error) {
    console.error("Error fetching gov actions:", error);
    throw new Error("Failed to fetch gov actions");
  }
}

export async function getGovActionById(
  id: string
): Promise<GovActionWithResults | null> {
  try {
    const govAction = await prisma.govAction.findUnique({
      where: { id },
      include: {
        votes: true,
      },
    });

    if (!govAction) {
      return null;
    }

    // Calculate vote results
    const totalVotes = govAction.votes.length;
    const yesVotes = govAction.votes.filter(
      (vote: Vote) => vote.choice === "YES"
    ).length;
    const noVotes = govAction.votes.filter(
      (vote: Vote) => vote.choice === "NO"
    ).length;
    const abstainVotes = govAction.votes.filter(
      (vote: Vote) => vote.choice === "ABSTAIN"
    ).length;

    // Calculate percentages
    const yesPercentage =
      totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
    const noPercentage =
      totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
    const abstainPercentage =
      totalVotes > 0 ? Math.round((abstainVotes / totalVotes) * 100) : 0;

    // Calculate days remaining
    const now = new Date();
    const deadline = new Date(govAction.votingDeadline);
    const timeDiff = deadline.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    return {
      id: govAction.id,
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
  } catch (error) {
    console.error("Error fetching gov action by ID:", error);
    throw new Error("Failed to fetch gov action");
  }
}

function formatCategoryName(category: GovActionType): string {
  switch (category) {
    case "info_action":
      return "Info Action";
    case "parameter_change":
      return "Parameter Change";
    case "treasury_withdrawals":
      return "Treasury Withdrawals";
    case "hard_fork_initiation":
      return "Hard Fork Initiation";
    case "new_committee":
      return "New Committee";
    case "new_constitution":
      return "New Constitution";
    case "no_confidence":
      return "No Confidence";
    default:
      return category;
  }
}
