/*
  Warnings:

  - The primary key for the `proposals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `requestedAmount` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `proposals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `proposals` will be added. If there are existing duplicate values, this will fail.

*/
-- Drop foreign key constraint first
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_proposalId_fkey";

-- DropIndex
DROP INDEX "public"."proposals_externalId_key";

-- AlterTable
ALTER TABLE "public"."proposals" DROP CONSTRAINT "proposals_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "externalId",
DROP COLUMN "requestedAmount",
DROP COLUMN "submissionDate",
DROP COLUMN "title",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "proposals_id_key" ON "public"."proposals"("id");

-- Recreate foreign key constraint
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public"."proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
