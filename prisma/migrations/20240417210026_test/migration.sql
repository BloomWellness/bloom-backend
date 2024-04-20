/*
  Warnings:

  - You are about to drop the `Mood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_userId_fkey";

-- DropTable
DROP TABLE "Mood";
