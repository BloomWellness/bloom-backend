/*
  Warnings:

  - Changed the type of `strategyType` on the `journal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mood` on the `mood` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "journal" DROP COLUMN "strategyType",
ADD COLUMN     "strategyType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mood" DROP COLUMN "mood",
ADD COLUMN     "mood" TEXT NOT NULL;
