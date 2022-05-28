-- CreateTable
CREATE TABLE "Address" (
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_orderId_key" ON "Address"("orderId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
