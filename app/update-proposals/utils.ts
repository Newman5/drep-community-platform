import prisma from "@/lib/prisma";
import { ProposalCategory } from "@prisma/client";

export async function fetchAllProposals() {
  try {
    const response = await fetch(
      `${process.env.BLOCKFROST_URL}/governance/proposals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "dmtr-api-key": `${process.env.DMTR_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: {
      tx_hash: string;
      cert_index: number;
      governance_type: ProposalCategory;
    }[] = await response.json();

    try {
      // Process each proposal in the response
      for (const proposal of data) {
        const proposalId = proposal.tx_hash + "#" + proposal.cert_index;

        // Check if proposal already exists
        const existingProposal = await prisma.allProposals.findUnique({
          where: { id: proposalId },
        });

        // Only create if it doesn't exist
        if (!existingProposal) {
          await prisma.allProposals.create({
            data: {
              id: proposalId,
              category: proposal.governance_type,
              expired: false,
            },
          });
        }
      }
    } catch (error) {
      console.error("Prisma upsert error:", error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function updateExpiredProposals() {
  try {
    const currentEpochResponse = await fetch(
      `${process.env.BLOCKFROST_URL}/epochs/latest`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "dmtr-api-key": `${process.env.DMTR_API_KEY}`,
        },
      }
    );

    if (!currentEpochResponse.ok) {
      throw new Error(`HTTP error! status: ${currentEpochResponse.status}`);
    }

    const currentEpochData: { epoch: number } =
      await currentEpochResponse.json();
    const currentEpoch = currentEpochData.epoch;

    const notExpiredProposals = await prisma.allProposals.findMany({
      where: { expired: false },
    });

    for (const proposal of notExpiredProposals) {
      const response = await fetch(
        `${process.env.BLOCKFROST_URL}/governance/proposals/${proposal.id.substring(
          0,
          proposal.id.indexOf("#")
        )}/${proposal.id.substring(proposal.id.indexOf("#") + 1)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "dmtr-api-key": `${process.env.DMTR_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: {
        tx_hash: string;
        cert_index: number;
        governance_type: string;
        governance_description: { tag: string };
        deposit: string;
        return_address: string;
        ratified_epoch: number | null;
        enacted_epoch: number | null;
        dropped_epoch: number | null;
        expired_epoch: number | null;
        expiration: number;
      } = await response.json();

      // If the current epoch is greater than or equal to the expiration epoch, mark as expired
      if (currentEpoch >= data.expiration) {
        await prisma.allProposals.update({
          where: { id: proposal.id },
          data: { expired: true },
        });
      }
    }
  } catch (error) {
    console.error("Error updating expired proposals:", error);
  }
}

export async function fetchDrepVotes() {
  const drepId = "drep1taxuxp3f9yvw5txzssxx54n6qy73r9ecc40c5mx4wthuw3r3mj6";
  try {
    const response = await fetch(
      `${process.env.BLOCKFROST_URL}/governance/dreps/${drepId}/votes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "dmtr-api-key": `${process.env.DMTR_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { tx_hash: string; cert_index: number; vote: 'yes' | 'no' | 'abstain' }[] = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWhichProposalWasVotedFor() {
  try {
    const response = await fetch(
      `${process.env.BLOCKFROST_URL}`,    // TO-DO
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "dmtr-api-key": `${process.env.DMTR_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { tx_hash: string; cert_index: number; vote: 'yes' | 'no' | 'abstain' }[] = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getPendingProposals() {
  try {
    const notExpiredProposals = await prisma.allProposals.findMany({
      where: { expired: false },
    });

    console.log("Not Expired Proposals:", notExpiredProposals);

    const drepVotes = await fetchDrepVotes();
    console.log("DRep Votes:", drepVotes);

    const pendingProposals = notExpiredProposals.filter(proposal =>
      !drepVotes.some(vote =>
        vote.tx_hash + "#" + vote.cert_index === proposal.id
      )
    );

    console.log("Pending Proposals:", pendingProposals);
    return pendingProposals;
  } catch (error) {
    console.error("Error fetching pending proposals:", error);
  }
}
