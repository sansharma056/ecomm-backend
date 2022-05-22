/*
  Warnings:

  - You are about to drop the column `token` on the `UserDetails` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userDetailsId_fkey";

-- AlterTable
ALTER TABLE "UserDetails" DROP COLUMN "token";

-- DropTable
DROP TABLE "Address";
