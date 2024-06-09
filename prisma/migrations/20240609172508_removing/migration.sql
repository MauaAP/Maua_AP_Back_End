/*
  Warnings:

  - You are about to drop the column `duration` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date]` on the table `Presence` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "duration";

-- CreateIndex
CREATE UNIQUE INDEX "Presence_date_key" ON "Presence"("date");
