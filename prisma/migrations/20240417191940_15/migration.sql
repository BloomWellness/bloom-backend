/*
  Warnings:

  - The primary key for the `cbt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cbt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `cbt_method_rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cbt_method_rating" DROP CONSTRAINT "cbt_method_rating_cbt_method_id_fkey";

-- DropForeignKey
ALTER TABLE "cbt_method_rating" DROP CONSTRAINT "cbt_method_rating_userId_fkey";

-- AlterTable
ALTER TABLE "cbt" DROP CONSTRAINT "cbt_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "cbt_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "cbt_method_rating";
