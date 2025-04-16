/*
  Warnings:

  - Added the required column `date_of_birth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geo_location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hometown` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "geo_location" TEXT NOT NULL,
ADD COLUMN     "hometown" TEXT NOT NULL,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT[];
