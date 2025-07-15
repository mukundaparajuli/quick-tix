/*
  Warnings:

  - You are about to drop the column `eventId` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `agendaId` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_eventId_fkey";

-- AlterTable
ALTER TABLE "agendas" DROP COLUMN "eventId",
ADD COLUMN     "agendasId" INTEGER;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "agendaId",
ADD COLUMN     "agendasId" INTEGER;

-- CreateTable
CREATE TABLE "Agendas" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_agendasId_fkey" FOREIGN KEY ("agendasId") REFERENCES "Agendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_agendasId_fkey" FOREIGN KEY ("agendasId") REFERENCES "Agendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
