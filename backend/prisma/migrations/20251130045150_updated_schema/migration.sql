-- AlterTable
ALTER TABLE "_EventMedia" ADD CONSTRAINT "_EventMedia_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventMedia_AB_unique";
