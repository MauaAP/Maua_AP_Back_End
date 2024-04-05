/*
  Warnings:

  - You are about to drop the column `registration` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_registration_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "registration";
