-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('FAILED', 'PENDING', 'SUCCESSFUL');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';
