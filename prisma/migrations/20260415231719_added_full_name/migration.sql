/*
  Warnings:

  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('Indoor', 'Outdoor');

-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('Outlets', 'AirConditioning', 'WiFi', 'Printing', 'Whiteboards', 'ReservableRooms', 'Accessible');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT NOT NULL;
