/*
  Warnings:

  - You are about to drop the column `name` on the `Row` table. All the data in the column will be lost.
  - You are about to drop the `EventSection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rowNumber` to the `Row` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "EventSection" DROP CONSTRAINT "EventSection_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSection" DROP CONSTRAINT "EventSection_sectionId_fkey";

-- AlterTable
ALTER TABLE "Row" DROP COLUMN "name",
ADD COLUMN     "rowNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "eventId" INTEGER;

-- DropTable
DROP TABLE "EventSection";

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentProvider" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "paymentResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
