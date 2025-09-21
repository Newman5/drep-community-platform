import prisma from "@/lib/prisma";
import { GovActionType } from "@prisma/client";
import { BlockfrostProvider, TxParser } from "@meshsdk/core";
import { CSLSerializer } from "@meshsdk/core-csl";

const fetcher = new BlockfrostProvider(`${process.env.DMTR_BLOCKFROST_URL}`);
const serializer = new CSLSerializer();
const txParser = new TxParser(serializer, fetcher);

export async function updateAllProposals() {
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
      governance_type: GovActionType;
    }[] = await response.json();

    try {
      // Process each proposal in the response
      for (const proposal of data) {
        const proposalId = proposal.tx_hash + "#" + proposal.cert_index;

        // Check if proposal already exists
        const existingProposal = await prisma.govAction.findUnique({
          where: { id: proposalId },
        });

        // Only create if it doesn't exist
        if (!existingProposal) {
          await prisma.govAction.create({
            data: {
              id: proposalId,
              category: proposal.governance_type,
              expired: false,
              votingDeadline: new Date(),
              voted: false,
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

    const notExpiredProposals = await prisma.govAction.findMany({
      where: { expired: false },
    });

    for (const proposal of notExpiredProposals) {
      const response = await fetch(
        `${
          process.env.BLOCKFROST_URL
        }/governance/proposals/${proposal.id.substring(
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
        await prisma.govAction.update({
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

    const data: {
      tx_hash: string;
      cert_index: number;
      vote: "yes" | "no" | "abstain";
    }[] = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWhichProposalWasVotedFor(txHash: string) {
  try {
    const response = await fetch(
      `${process.env.BLOCKFROST_URL_DOLOS}/txs/${txHash}/cbor`,
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

    const data = await response.json();
    const txBody: {
      votes: { vote: { govActionId: { txHash: string; txIndex: number } } }[];
    } = await txParser.parse(data.cbor);

    let govActions: { txHash: string; txIndex: number }[] = [];
    if (txBody.votes && txBody.votes.length > 0) {
      govActions = txBody.votes.map((vote) => {
        return {
          txHash: vote.vote.govActionId.txHash,
          txIndex: vote.vote.govActionId.txIndex,
        };
      });
    }
    return govActions;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function updateProposalAsVoted() {
  try {
    const drepVotes = await fetchDrepVotes();

    for (const vote of drepVotes) {
      try {
        const govActionsVotedFor = await fetchWhichProposalWasVotedFor(
          vote.tx_hash
        );

        const pendingVotes = await prisma.govAction.findMany({
          where: { voted: false },
        });
        for (const action of govActionsVotedFor) {
          const proposalId = action.txHash + "#" + action.txIndex;
          const matchedProposal = pendingVotes.find(
            (proposal) => proposal.id === proposalId
          );
          if (matchedProposal) {
            await prisma.govAction.update({
              where: { id: proposalId },
              data: { voted: true },
            });
          }
        }
      } catch (error) {
        console.error(
          `Error fetching proposal for vote ${vote.tx_hash}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error updating proposals as voted:", error);
    throw error;
  }
}
