# 🧭 DRep Community Platform — Local Development Guide

## 🌐 Overview

The **DRep Community Platform** is a community-built and community-governed project under the **Gimbalabs** umbrella. Funded through the Gimbalabs governance process, it is developed and maintained by Gimbalabs contributors as an open, evolving DApp that supports the operations of the **Gimbalabs DRep (Delegated Representative)** on the Cardano blockchain.

The platform’s purpose is to strengthen communication and coordination between the Gimbalabs DRep and their community constituency. It provides tools for transparency, participation, and education around Cardano governance. Through this portal, constituents can stay informed about upcoming governance votes, receive alerts, and engage in straw polls or opinion surveys to express their perspectives on proposed governance actions.

Technically, the platform is built with **Next.js**, **Discord.js**, **Supabase**, **Prisma**, and other modern web technologies. It integrates directly with Cardano governance data (via Blockfrost) and Discord to streamline communication, automate alerts, and enable interactive governance experiences. Community members can contribute to the ongoing development of the portal, ensuring it remains open-source, transparent, and aligned with the collaborative mission of Gimbalabs.

---

## 🧩 System Architecture

```mermaid
graph TD
  subgraph User Layer
    A1[Community Member] -->|Delegates / Votes| B1[DRep Portal]
    A2[DRep / Admin] -->|Posts Updates| B1
  end

  subgraph Application Layer
    B1[DRep Portal (Next.js)] -->|Fetches Data| C1[(Supabase / Postgres)]
    B2[Discord Bot (Node.js + Discord.js)] -->|Reads/Writes| C1
    B1 -->|Triggers Alerts| B2
  end

  subgraph External Services
    C1 -->|Stores| D1[Prisma ORM]
    C1 -->|Receives Data| D2[Blockfrost API]
    D2 -->|Provides Governance Data| E1[Cardano Blockchain]
  end

  style A1 fill:#fef6e4,stroke:#f0a500,stroke-width:2px
  style A2 fill:#fef6e4,stroke:#f0a500,stroke-width:2px
  style B1 fill:#cde3ff,stroke:#003366,stroke-width:2px
  style B2 fill:#d3f8e2,stroke:#0b5345,stroke-width:2px
  style C1 fill:#f8d7da,stroke:#842029,stroke-width:2px
  style D2 fill:#e2d9f3,stroke:#4b0082,stroke-width:2px
  style E1 fill:#d0f0c0,stroke:#007f5f,stroke-width:2px
```

**Diagram explanation:**
- The **Next.js Portal** allows the community to view governance actions and participate in straw polls.
- The **Discord Bot** provides automated alerts and two-way communication in Discord.
- Both the Portal and Bot share the same **Supabase (Postgres)** database.
- **Blockfrost API** provides Cardano governance data which is stored in the database and presented in the portal.
- The **Cardano blockchain** is the ultimate source of truth for governance actions and DRep activity.

---

## ⚙️ Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm or pnpm
- Access to a PostgreSQL database (Supabase is fine)
- Blockfrost API key (for Cardano governance data)
- Discord bot token (for posting updates)

---

## 🧩 Environment Setup

Create a `.env` file in the project root with:

```bash
DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@db.<your-project-ref>.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
BLOCKFROST_API_URL="https://cardano-mainnet.blockfrost.io/api/v0"
BLOCKFROST_API_KEY="your_blockfrost_api_key"
```

> ⚠️ **Do not commit this file.**  
> Add `.env` to `.gitignore`.

---

## 🧱 Database Setup

### 1. Verify Prisma schema

```bash
npx prisma validate
```

### 2. Push schema to your database

```bash
npx prisma db push
```

This creates the tables defined in `prisma/schema.prisma`.

### 3. (Optional) Open Prisma Studio

```bash
npx prisma studio
```

This lets you view and edit data in your Supabase database from your browser.

---

## 🖥️ Run the Portal (Next.js App)

From the project root:

```bash
npm install
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🤖 Run the Discord Bot

In a second terminal:

```bash
cd discord-bot
npm install
npm run dev
```

Create a `.env` file in `/discord-bot`:

```bash
DISCORD_TOKEN="your_discord_bot_token"
CHANNEL_ID="your_channel_id"
BLOCKFROST_API_URL="https://cardano-mainnet.blockfrost.io/api/v0"
BLOCKFROST_API_KEY="your_blockfrost_api_key"
DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@db.<your-project-ref>.supabase.co:5432/postgres"
```

---

## 🧰 Common Commands

| Command | Description |
|----------|--------------|
| `npx prisma generate` | Rebuild Prisma client |
| `npx prisma db push` | Sync schema to DB |
| `npx prisma studio` | Open DB browser |
| `npm run dev` | Start the web portal |
| `npm run build` / `npm run start` | Production mode |
| `cd discord-bot && npm run dev` | Run Discord bot locally |

---

## 🧠 Tips

- Supabase = persistent cloud database (no Docker needed)
- `.env` = never commit, only local use
- You can share your Supabase DB across the app and bot
- To reset your DB: use Supabase dashboard → SQL → truncate tables

---

## Learn More

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


