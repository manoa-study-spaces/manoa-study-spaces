-- AlterEnum
ALTER TYPE "Amenity" ADD VALUE 'WaterRefill';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "spaceType" "SpaceType" NOT NULL DEFAULT 'Indoor';

-- AlterTable
ALTER TABLE "Times" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "StudyGroup" (
    "groupID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "StudyGroup_pkey" PRIMARY KEY ("groupID")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmenityEntity" (
    "id" SERIAL NOT NULL,
    "name" "Amenity" NOT NULL,

    CONSTRAINT "AmenityEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingAmenity" (
    "listingID" INTEGER NOT NULL,
    "amenityID" INTEGER NOT NULL,

    CONSTRAINT "ListingAmenity_pkey" PRIMARY KEY ("listingID","amenityID")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "AmenityEntity_name_key" ON "AmenityEntity"("name");

-- AddForeignKey
ALTER TABLE "StudyGroup" ADD CONSTRAINT "StudyGroup_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("groupID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_listingID_fkey" FOREIGN KEY ("listingID") REFERENCES "Listing"("listingID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_amenityID_fkey" FOREIGN KEY ("amenityID") REFERENCES "AmenityEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
