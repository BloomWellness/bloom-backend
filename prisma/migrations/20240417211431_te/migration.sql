/*
  Warnings:

  - You are about to drop the column `userId` on the `Mood` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_userId_fkey";

-- AlterTable
ALTER TABLE "Mood" DROP COLUMN "userId";
