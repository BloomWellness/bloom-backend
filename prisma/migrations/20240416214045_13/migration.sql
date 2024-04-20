/*
  Warnings:

  - You are about to drop the column `date` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the `cbt_favourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strategy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategyType` to the `journal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('HAPPY', 'SAD', 'SHOCKED', 'ANGRY');

-- DropForeignKey
ALTER TABLE "cbt_favourite" DROP CONSTRAINT "cbt_favourite_cbtId_fkey";

-- DropForeignKey
ALTER TABLE "cbt_favourite" DROP CONSTRAINT "cbt_favourite_userId_fkey";

-- DropForeignKey
ALTER TABLE "strategy" DROP CONSTRAINT "strategy_journalId_fkey";

-- AlterTable
ALTER TABLE "journal" DROP COLUMN "date",
DROP COLUMN "mood",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "strategyType" "StrategyType" NOT NULL;

-- DropTable
DROP TABLE "cbt_favourite";

-- DropTable
DROP TABLE "strategy";

-- CreateTable
CREATE TABLE "mood" (
    "id" TEXT NOT NULL,
    "mood" "Mood" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mood_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mood" ADD CONSTRAINT "mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
