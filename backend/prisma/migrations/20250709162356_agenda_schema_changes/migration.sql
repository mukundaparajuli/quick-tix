/*
  Warnings:

  - Added the required column `eventId` to the `agendas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_agendaId_fkey";

-- AlterTable
ALTER TABLE "agendas" ADD COLUMN     "eventId" INTEGER NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
