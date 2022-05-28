/*
  Warnings:

  - Added the required column `pincode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
