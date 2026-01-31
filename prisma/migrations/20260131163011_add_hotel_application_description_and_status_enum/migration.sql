/*
  Warnings:

  - The `status` column on the `hotel_applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "HotelApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "hotel_applications" ADD COLUMN     "description" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "HotelApplicationStatus" NOT NULL DEFAULT 'pending';
