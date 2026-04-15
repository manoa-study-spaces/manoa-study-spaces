-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('excellent', 'good', 'fair', 'poor');

CREATE TYPE "Occupancy" AS ENUM ('Empty', 'Moderate', 'Crowded');

CREATE TYPE "NoiseLevel" AS ENUM ('Quiet', 'Moderate', 'Loud');

CREATE TYPE "FoodAllowed" AS ENUM ('Permitted', 'Prohibited', 'Water');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stuff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "condition" "Condition" NOT NULL DEFAULT 'good',
    "owner" TEXT NOT NULL,

    CONSTRAINT "Stuff_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Listing" (
    "listingID"    SERIAL NOT NULL,
    "buildingName" TEXT NOT NULL, 
    "roomNumber"   TEXT NOT NULL,
    "times"        TEXT[] NOT NULL,
    "pictures"     TEXT[] NOT NULL,
    "occupancy"        "Occupancy"    NOT NULL DEFAULT 'Empty',
    "foodAllowed"      "FoodAllowed"  NOT NULL DEFAULT 'Permitted',
    "noiseLevel"       "NoiseLevel"   NOT NULL DEFAULT 'Moderate',

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("listingID")
);


CREATE TABLE "Image" (
    "imageID" SERIAL NOT NULL,
    "listingID" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageID")
);

CREATE TABLE "TimeSlot" (
    "timeID" SERIAL NOT NULL,
    "listingID" INTEGER NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("timeID")
);
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
