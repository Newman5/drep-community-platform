-- CreateEnum
CREATE TYPE "public"."proposal_category" AS ENUM ('INFO_ACTION', 'PARAMETER_CHANGE', 'TREASURY_WITHDRAWAL', 'HARD_FORK_INITIATION', 'UPDATE_COMMITTEE', 'NEW_CONSTITUTION', 'NO_CONFIDENCE');

-- CreateEnum
CREATE TYPE "public"."proposal_status" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."vote_choice" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "public"."governance_event_type" AS ENUM ('PROPOSAL_SUBMITTED', 'VOTING_STARTED', 'VOTING_ENDED', 'PROPOSAL_RATIFIED', 'PROPOSAL_REJECTED', 'DREP_REGISTERED', 'DELEGATION_CHANGED');

-- CreateTable
CREATE TABLE "public"."AllProposals" (
    "id" TEXT NOT NULL,
    "category" "public"."proposal_category" NOT NULL,
    "expired" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDRep" BOOLEAN NOT NULL DEFAULT false,
    "drepTitle" TEXT,
    "drepBio" TEXT,
    "drepWebsite" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."proposals" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."proposal_category" NOT NULL,
    "status" "public"."proposal_status" NOT NULL,
    "requestedAmount" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "votingDeadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submitterId" TEXT NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."votes" (
    "id" TEXT NOT NULL,
    "choice" "public"."vote_choice" NOT NULL,
    "rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."drep_delegations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "drepId" TEXT NOT NULL,

    CONSTRAINT "drep_delegations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."governance_events" (
    "id" TEXT NOT NULL,
    "type" "public"."governance_event_type" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "governance_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllProposals_id_key" ON "public"."AllProposals"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletId_key" ON "public"."users"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_externalId_key" ON "public"."proposals"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_proposalId_key" ON "public"."votes"("userId", "proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "drep_delegations_userId_isActive_key" ON "public"."drep_delegations"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "public"."proposals" ADD CONSTRAINT "proposals_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public"."proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drep_delegations" ADD CONSTRAINT "drep_delegations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drep_delegations" ADD CONSTRAINT "drep_delegations_drepId_fkey" FOREIGN KEY ("drepId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
