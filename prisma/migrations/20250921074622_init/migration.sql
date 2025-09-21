-- CreateEnum
CREATE TYPE "public"."gov_action_type" AS ENUM ('info_action', 'parameter_change', 'treasury_withdrawals', 'hard_fork_initiation', 'new_committee', 'new_constitution', 'no_confidence');

-- CreateEnum
CREATE TYPE "public"."vote_choice" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateTable
CREATE TABLE "public"."GovAction" (
    "id" TEXT NOT NULL,
    "category" "public"."gov_action_type" NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "voted" BOOLEAN NOT NULL,
    "votingDeadline" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."votes" (
    "id" TEXT NOT NULL,
    "choice" "public"."vote_choice" NOT NULL,
    "rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voter" TEXT NOT NULL,
    "govActionId" TEXT NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GovAction_id_key" ON "public"."GovAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_voter_govActionId_key" ON "public"."votes"("voter", "govActionId");

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_govActionId_fkey" FOREIGN KEY ("govActionId") REFERENCES "public"."GovAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
