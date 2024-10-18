/*
  Warnings:

  - Made the column `venueId` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "venueId" SET NOT NULL,
ALTER COLUMN "venueId" DROP DEFAULT;
