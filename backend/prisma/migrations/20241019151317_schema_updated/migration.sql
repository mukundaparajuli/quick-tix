/*
  Warnings:

  - You are about to drop the column `venueId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `venueName` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_venueId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_venueId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "venueId";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "venueId",
ADD COLUMN     "locationId" INTEGER,
ADD COLUMN     "venueName" TEXT DEFAULT 'Syangja City Hall';

-- DropTable
DROP TABLE "Venue";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
