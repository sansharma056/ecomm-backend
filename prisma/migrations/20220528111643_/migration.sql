-- DropIndex
DROP INDEX "OrderLine_productId_key";

-- AlterTable
ALTER TABLE "OrderLine" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id");
