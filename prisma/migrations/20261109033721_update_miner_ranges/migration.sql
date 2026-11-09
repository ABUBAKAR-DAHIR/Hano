/*
  Warnings:

  - The values [ONE,TWO_TO_TEN,ELEVEN_TO_FIFTY,FIFTY_ONE_TO_TWO_HUNDRED,OVER_TWO_HUNDRED] on the enum `MinerQuantity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MinerQuantity_new" AS ENUM ('ONE_TO_FIVE', 'SIX_TO_TWENTY', 'TWENTY_ONE_TO_ONE_HUNDRED', 'OVER_ONE_HUNDRED');
ALTER TABLE "contact_messages" ALTER COLUMN "minerCount" TYPE "MinerQuantity_new" USING ("minerCount"::text::"MinerQuantity_new");
ALTER TYPE "MinerQuantity" RENAME TO "MinerQuantity_old";
ALTER TYPE "MinerQuantity_new" RENAME TO "MinerQuantity";
DROP TYPE "public"."MinerQuantity_old";
COMMIT;
