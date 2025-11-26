-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "paymentUrl" TEXT,
ADD COLUMN     "pidx" TEXT;

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_pidx_idx" ON "Payment"("pidx");
