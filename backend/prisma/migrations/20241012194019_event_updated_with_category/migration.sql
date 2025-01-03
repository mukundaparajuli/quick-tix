-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC_CONCERTS', 'STANDUP_COMEDY', 'IMPROV_COMEDY', 'THEATER_PERFORMANCES', 'MUSICALS', 'OPERA', 'DANCE_PERFORMANCES', 'MAGIC_SHOWS', 'FESTIVALS', 'SPORTS_EVENTS', 'TALENT_SHOWS', 'WORKSHOPS_CLASSES', 'CONFERENCES_TALKS', 'FAMILY_KIDS_EVENTS', 'VIRTUAL_EVENTS', 'OTHERS');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT 'OTHERS';
