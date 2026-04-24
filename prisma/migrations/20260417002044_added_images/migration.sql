/*
  Warnings:

  - Added the required column `MIMEType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datasource` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "MIMEType" TEXT NOT NULL,
ADD COLUMN     "datasource" BYTEA NOT NULL;
