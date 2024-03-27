-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "host" TEXT NOT NULL,
    "manager" TEXT[],
    "duration" TEXT NOT NULL,
    "hostEmail" TEXT[],
    "hostPhone" TEXT[],
    "local" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "goals" TEXT NOT NULL,
    "contentActivities" TEXT[],
    "developedCompetencies" TEXT NOT NULL,
    "initTime" TIMESTAMP(3) NOT NULL,
    "finishTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
