/*
  Warnings:

  - You are about to drop the column `helpful_activites` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the column `red_flags` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the column `self_care_strategies` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the column `sources_of_hope` on the `journal` table. All the data in the column will be lost.
  - Added the required column `description` to the `strategy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "journal" DROP COLUMN "helpful_activites",
DROP COLUMN "red_flags",
DROP COLUMN "self_care_strategies",
DROP COLUMN "sources_of_hope";

-- AlterTable
ALTER TABLE "strategy" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;
