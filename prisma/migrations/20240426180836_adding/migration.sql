/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId,date]` on the table `Presence` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Presence_eventId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Presence_eventId_userId_date_key" ON "Presence"("eventId", "userId", "date");
