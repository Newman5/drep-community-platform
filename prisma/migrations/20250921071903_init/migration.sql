/*
  Warnings:

  - You are about to drop the column `status` on the `GovAction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voter,govActionId]` on the table `votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voter` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."votes_govActionId_key";

-- AlterTable
ALTER TABLE "public"."GovAction" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."votes" ADD COLUMN     "voter" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."status";

-- CreateIndex
CREATE UNIQUE INDEX "votes_voter_govActionId_key" ON "public"."votes"("voter", "govActionId");
