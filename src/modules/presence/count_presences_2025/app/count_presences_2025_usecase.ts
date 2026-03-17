import { prisma } from "../../../../../prisma/prisma";

export interface EventPresenceCount2025 {
  eventName: string;
  date: string;
  totalPresences: number;
}

export interface CountPresences2025Result {
  events: EventPresenceCount2025[];
}

export class CountPresences2025Usecase {
  async execute(): Promise<CountPresences2025Result> {
    const startOf2025 = new Date("2025-01-01T00:00:00.000Z");
    const startOf2026 = new Date("2026-01-01T00:00:00.000Z");

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startOf2025,
          lt: startOf2026,
        },
      },
      select: {
        eventName: true,
        date: true,
        _count: {
          select: {
            presences: true,
            ExternalPresence: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const eventsWithTotal: EventPresenceCount2025[] = events.map((event) => ({
      eventName: event.eventName,
      date: event.date.toISOString().split("T")[0],
      totalPresences: event._count.presences + event._count.ExternalPresence,
    }));

    return { events: eventsWithTotal };
  }
}
