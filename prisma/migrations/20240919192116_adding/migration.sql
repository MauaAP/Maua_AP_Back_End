-- CreateTable
CREATE TABLE "ExternalPresence" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalPresence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalPresence" ADD CONSTRAINT "ExternalPresence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
