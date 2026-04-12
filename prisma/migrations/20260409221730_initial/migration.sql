/*
  Warnings:

  - You are about to drop the column `pictures` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "pictures",
DROP COLUMN "times",
ALTER COLUMN "occupancy" SET DEFAULT 'Moderate',
ALTER COLUMN "foodAllowed" SET DEFAULT 'Prohibited';

-- DropTable
DROP TABLE "TimeSlot";

-- CreateTable
CREATE TABLE "Times" (
    "timeID" SERIAL NOT NULL,
    "listingID" INTEGER NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "Times_pkey" PRIMARY KEY ("timeID")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listingID_fkey" FOREIGN KEY ("listingID") REFERENCES "Listing"("listingID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_listingID_fkey" FOREIGN KEY ("listingID") REFERENCES "Listing"("listingID") ON DELETE CASCADE ON UPDATE CASCADE;
