/*
  Warnings:

  - You are about to drop the column `proposalId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the `AllProposals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `drep_delegations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `governance_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proposals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[govActionId]` on the table `votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `govActionId` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."gov_action_type" AS ENUM ('info_action', 'parameter_change', 'treasury_withdrawals', 'hard_fork_initiation', 'new_committee', 'new_constitution', 'no_confidence');

-- CreateEnum
CREATE TYPE "public"."status" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "public"."drep_delegations" DROP CONSTRAINT "drep_delegations_drepId_fkey";

-- DropForeignKey
ALTER TABLE "public"."drep_delegations" DROP CONSTRAINT "drep_delegations_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."proposals" DROP CONSTRAINT "proposals_submitterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_userId_fkey";

-- DropIndex
DROP INDEX "public"."votes_userId_proposalId_key";

-- AlterTable
ALTER TABLE "public"."votes" DROP COLUMN "proposalId",
DROP COLUMN "userId",
ADD COLUMN     "govActionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AllProposals";

-- DropTable
DROP TABLE "public"."drep_delegations";

-- DropTable
DROP TABLE "public"."governance_events";

-- DropTable
DROP TABLE "public"."proposals";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."governance_event_type";

-- DropEnum
DROP TYPE "public"."proposal_category";

-- DropEnum
DROP TYPE "public"."proposal_status";

-- CreateTable
CREATE TABLE "public"."GovAction" (
    "id" TEXT NOT NULL,
    "category" "public"."gov_action_type" NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "status" "public"."status" NOT NULL,
    "votingDeadline" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GovAction_id_key" ON "public"."GovAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_govActionId_key" ON "public"."votes"("govActionId");

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_govActionId_fkey" FOREIGN KEY ("govActionId") REFERENCES "public"."GovAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
