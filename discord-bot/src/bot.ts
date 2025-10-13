import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import cron from "node-cron";
import express from "express"; 
import { getProposalsFromAPI } from "./get-proposals";

// Load from environment variables
const TOKEN = process.env.DISCORD_TOKEN as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

if (!TOKEN || !CHANNEL_ID) {
  throw new Error("Missing DISCORD_TOKEN or CHANNEL_ID in environment variables");
}

/**
 * Generate Discord embeds from already-fetched unvoted proposals data
 */
function generateEmbeds(unvotedProposals: any[], maxProposals: number = 10): any[] {
  if (unvotedProposals.length === 0) {
    return [{
      title: "✅ All Caught Up!",
      description: "Gimbalabs DRep has voted on all pending proposals.",
      color: 0x2ecc71,
      timestamp: new Date().toISOString(),
    }];
  }

  const embeds: any[] = [];

  const colors = {
    new_constitution: 0x2ecc71,
    info_action: 0xe67e22,
    parameter_change: 0x3498db,
  };
  
    unvotedProposals.forEach((proposal, index) => {
      embeds.push({
        title: `🗳️ ${proposal.title || 'Untitled Proposal'}`,
        description: `Category: **${proposal.category}**`,
        fields: [
          {
            name: 'Voting Deadline',
            value: new Date(proposal.votingDeadline).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            inline: false,
          },
          {
            name: 'Proposal ID',
            value: `\`${proposal.id.slice(0, 12)}...\``,
            inline: true,
          },
          {
            name: 'GovTool Link',
            value: `[Open in GovTool](https://gov.tools/governance_actions/${proposal.id})`,
            inline: false,
          },
        ],
        color: 0x5865f2,
        footer: {
          text: `Unvoted proposal #${index + 1}`,
        },
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

    const unvotedProposals = await getProposalsFromAPI();

    if (unvotedProposals.length === 0) {
      console.log("✅ All caught up.");
      await channel.send("✅ **All caught up! Gimbalabs DRep has voted on all pending proposals.**");
    } else {
      console.log(`🚨 Found ${unvotedProposals.length} unvoted proposal(s).`);

      await channel.send(`🚨 **VOTES NEEDED**: ${unvotedProposals.length} proposal(s) require Gimbalabs DRep votes!`);

      const embeds = generateEmbeds(unvotedProposals, 10);

      for (const embed of embeds) {
        await channel.send({ embeds: [embed] });
        await new Promise((r) => setTimeout(r, 500)); // avoid rate limits
      }

      if (unvotedProposals.length > 10) {
        await channel.send(`📋 **Note**: Showing first 10 of ${unvotedProposals.length} proposals.`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching unvoted proposals:", error);
    const channel = (await client.channels.fetch(CHANNEL_ID)) as TextChannel;
    if (channel) {
      await channel.send("❌ **Error fetching unvoted proposals. Please check logs.**");
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
  cron.schedule("0 0 * * *", async () => {
    await checkProposalsAndSend(client);
  }, { timezone: "UTC" });
});

// Login
client.login(TOKEN);

// 👇 ADD THIS: tiny express server to keep Render happy
const app = express();
app.get("/", (_, res) => res.send("Bot is running ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Express server running on port ${PORT}`);
});
