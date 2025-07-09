/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `organizer_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizerProfileId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `organizer_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizerProfileId_fkey";

-- AlterTable
ALTER TABLE "organizer_profiles" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizer_profiles_userId_key" ON "organizer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_organizerProfileId_key" ON "users"("organizerProfileId");

-- AddForeignKey
ALTER TABLE "organizer_profiles" ADD CONSTRAINT "organizer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
