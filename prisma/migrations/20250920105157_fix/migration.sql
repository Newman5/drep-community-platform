/*
  Warnings:

  - The values [treasury_withdrawal] on the enum `proposal_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."proposal_category_new" AS ENUM ('info_action', 'parameter_change', 'treasury_withdrawals', 'hard_fork_initiation', 'update_committee', 'new_constitution', 'no_confidence');
ALTER TABLE "public"."AllProposals" ALTER COLUMN "category" TYPE "public"."proposal_category_new" USING ("category"::text::"public"."proposal_category_new");
ALTER TABLE "public"."proposals" ALTER COLUMN "category" TYPE "public"."proposal_category_new" USING ("category"::text::"public"."proposal_category_new");
ALTER TYPE "public"."proposal_category" RENAME TO "proposal_category_old";
ALTER TYPE "public"."proposal_category_new" RENAME TO "proposal_category";
DROP TYPE "public"."proposal_category_old";
COMMIT;
