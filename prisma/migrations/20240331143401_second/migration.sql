/*
  Warnings:

  - You are about to drop the column `token` on the `email_verification` table. All the data in the column will be lost.
  - Added the required column `otc` to the `email_verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_verification" DROP COLUMN "token",
ADD COLUMN     "otc" INTEGER NOT NULL;
