/*
  Warnings:

  - Added the required column `imgURL` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imgURL" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
