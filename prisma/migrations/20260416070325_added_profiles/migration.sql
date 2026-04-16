-- CreateEnum
CREATE TYPE "Standing" AS ENUM ('Freshman', 'Sophmore', 'Junior', 'Senior', 'Graduate', 'Other');

-- CreateTable
CREATE TABLE "ProfileImage" (
    "imageID" SERIAL NOT NULL,
    "profileID" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "ProfileImage_pkey" PRIMARY KEY ("imageID")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL,
    "profileID" SERIAL NOT NULL,
    "major" TEXT NOT NULL,
    "classes" TEXT NOT NULL,
    "Interests" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "standing" "Standing" NOT NULL DEFAULT 'Freshman',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileID")
);

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profileID") ON DELETE RESTRICT ON UPDATE CASCADE;
