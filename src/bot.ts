import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import cron from "node-cron";
import { pendingProposalGimbalabsDrepHasNotVotedYet } from "./gimbalabs-drep";

// Load from environment variables
const TOKEN = process.env.DISCORD_TOKEN as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

if (!TOKEN || !CHANNEL_ID) {
  throw new Error(
    "Missing DISCORD_TOKEN or CHANNEL_ID in environment variables"
  );
}

/**
 * Generate Discord embeds from already-fetched unvoted proposals data
 */
function generateEmbedsFromUnvotedProposals(
  unvotedProposals: any[],
  maxProposals: number = 10
): any[] {
  if (unvotedProposals.length === 0) {
    return [
      {
        title: "✅ All Caught Up!",
        description: "Gimbalabs DRep has voted on all pending proposals.",
        color: 0x2ecc71,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  const embeds: any[] = [];

  // Summary embed
  // embeds.push({
  //   title: "🔍 Pending Proposals - Votes Needed",
  //   description: `Found ${unvotedProposals.length} pending proposal(s) that Gimbalabs DRep has not voted on yet.`,
  //   fields: [
  //     {
  //       name: "📊 Total Unvoted",
  //       value: unvotedProposals.length.toString(),
  //       inline: true,
  //     },
  //   ],
  //   color: 0xf39c12,
  //   timestamp: new Date().toISOString(),
  // });

  // Individual proposals
  const limitedProposals = unvotedProposals.slice(0, maxProposals);
  limitedProposals.forEach((proposal, index) => {
    embeds.push({
      title: `⏳ Unvoted Proposal #${index + 1}`,
      fields: [
        {
          name: "Transaction Hash",
          value: `\`${proposal.tx_hash.substring(0, 16)}...\``,
          inline: true,
        },
        {
          name: "Certificate Index",
          value: proposal.cert_index.toString(),
          inline: true,
        },
        {
          name: "Governance Action",
          value: proposal.governance_type || "Unknown",
          inline: true,
        },
        {
          name: "Expiry Epoch",
          value: proposal.expiration?.toString() || "Unknown",
          inline: true,
        },
        {
          name: "GovTool",
          value: `[Link](https://gov.tools/governance_actions/${proposal.tx_hash}#${proposal.cert_index})`,
          inline: true,
        },
      ],
      color: 0xe67e22,
      timestamp: new Date().toISOString(),
    });
  });

  return embeds;
}

// 🔄 Shared logic
async function checkProposalsAndSend(client: Client) {
  console.log("🔍 Checking for pending proposals...");

  try {
    const channel = (await client.channels.fetch(CHANNEL_ID)) as TextChannel;
    if (!channel) {
      console.error("Channel not found!");
      return;
    }

    const unvotedProposals = await pendingProposalGimbalabsDrepHasNotVotedYet();

    if (unvotedProposals.length === 0) {
      console.log("✅ All caught up.");
      await channel.send(
        "✅ **All caught up! Gimbalabs DRep has voted on all pending proposals.**"
      );
    } else {
      console.log(`🚨 Found ${unvotedProposals.length} unvoted proposal(s).`);

      await channel.send(
        `🚨 **VOTES NEEDED**: ${unvotedProposals.length} proposal(s) require Gimbalabs DRep votes!`
      );

      const embeds = generateEmbedsFromUnvotedProposals(unvotedProposals, 10);

      for (const embed of embeds) {
        await channel.send({ embeds: [embed] });
        await new Promise((r) => setTimeout(r, 500)); // avoid rate limits
      }

      if (unvotedProposals.length > 10) {
        await channel.send(
          `📋 **Note**: Showing first 10 of ${unvotedProposals.length} proposals.`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error fetching unvoted proposals:", error);
    const channel = (await client.channels.fetch(CHANNEL_ID)) as TextChannel;
    if (channel) {
      await channel.send(
        "❌ **Error fetching unvoted proposals. Please check logs.**"
      );
    }
  }
}

// Create bot client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// When bot is ready
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);

  // Do the check immediately
  await checkProposalsAndSend(client);

  // Schedule to run daily at 00:00 UTC
  cron.schedule(
    "0 0 * * *",
    async () => {
      await checkProposalsAndSend(client);
    },
    {
      timezone: "UTC",
    }
  );
});

// Login
client.login(TOKEN);
