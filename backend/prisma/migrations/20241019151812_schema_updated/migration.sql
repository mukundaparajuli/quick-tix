/*
  Warnings:

  - Made the column `venueName` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "venueName" SET NOT NULL,
ALTER COLUMN "venueName" DROP DEFAULT;
