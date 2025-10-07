import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import cron from "node-cron";
import express from "express"; // 👈 add express
import { pendingProposalGimbalabsDrepHasNotVotedYet } from "./gimbalabs-drep";

// Load from environment variables
const TOKEN = process.env.DISCORD_TOKEN as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

if (!TOKEN || !CHANNEL_ID) {
  throw new Error("Missing DISCORD_TOKEN or CHANNEL_ID in environment variables");
}

/**
 * Generate Discord embeds from already-fetched unvoted proposals data
 */
function generateEmbedsFromUnvotedProposals(unvotedProposals: any[], maxProposals: number = 10): any[] {
  if (unvotedProposals.length === 0) {
    return [{
      title: "✅ All Caught Up!",
      description: "Gimbalabs DRep has voted on all pending proposals.",
      color: 0x2ecc71,
      timestamp: new Date().toISOString(),
    }];
  }

  const embeds: any[] = [];
  const limitedProposals = unvotedProposals.slice(0, maxProposals);

  console.log(`what's at limitedProposal?`, limitedProposals[0]);
  console.log(`what's at limitedProposal.json_metadata?`, limitedProposals[0].json_metadata);
  console.log(`what's at limitedProposal.json_metadata.body?`, limitedProposals[0].json_metadata.body);
  console.log(`what's at limitedProposal.json_metadata.body.title?`, limitedProposals[0].json_metadata.body.title);
  limitedProposals.forEach((proposal, index) => {
    embeds.push({
      //use title from unvotedProposals.json_metadata.body.title if exists
      title: proposal.json_metadata?.body?.title || `⏳ Unvoted Proposal #${index + 1}`,
      fields: [
        { name: "Transaction Hash", value: `\`${proposal.tx_hash.substring(0, 16)}...\``, inline: true },
        { name: "Certificate Index", value: proposal.cert_index.toString(), inline: true },
        { name: "Governance Action", value: proposal.governance_type || "Unknown", inline: true },
        { name: "Expiry Epoch", value: proposal.expiration?.toString() || "Unknown", inline: true },
        { name: "GovTool", value: `[Link](https://gov.tools/governance_actions/${proposal.tx_hash}#${proposal.cert_index})`, inline: true },
        { name: "Portal", value: `[Link](https://drep.gimbalabs.com/proposals/${proposal.tx_hash}%23${proposal.cert_index})`, inline: true },
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
      await channel.send("✅ **All caught up! Gimbalabs DRep has voted on all pending proposals.**");
    } else {
      console.log(`🚨 Found ${unvotedProposals.length} unvoted proposal(s).`);

      await channel.send(`🚨 **VOTES NEEDED**: ${unvotedProposals.length} proposal(s) require Gimbalabs DRep votes!`);

      const embeds = generateEmbedsFromUnvotedProposals(unvotedProposals, 10);

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
