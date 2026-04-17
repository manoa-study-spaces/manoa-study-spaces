/*
  Warnings:

  - You are about to drop the column `datasource` on the `Image` table. All the data in the column will be lost.
  - Added the required column `data` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "datasource",
ADD COLUMN     "data" BYTEA NOT NULL;
