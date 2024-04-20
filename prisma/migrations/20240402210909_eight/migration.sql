/*
  Warnings:

  - You are about to drop the column `isVerified` on the `email_verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "email_verification" DROP COLUMN "isVerified";
