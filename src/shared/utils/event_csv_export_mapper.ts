import type { Event as PrismaEvent } from "@prisma/client";

/**
 * Colunas do CSV de exportação de eventos (1:1 com campos persistidos em Event, sem joins).
 * Arrays serializados como JSON; datas em ISO 8601 (UTC).
 */
export const EVENT_CSV_FIELD_NAMES = [
  "id",
  "eventName",
  "date",
  "host",
  "manager",
  "hostEmail",
  "hostPhone",
  "local",
  "modality",
  "targetAudience",
  "activityType",
  "maxParticipants",
  "goals",
  "period",
  "contentActivities",
  "developedCompetencies",
  "initTime",
  "finishTime",
  "link",
] as const;

export type EventCsvFieldName = (typeof EVENT_CSV_FIELD_NAMES)[number];

export type EventCsvRow = Record<EventCsvFieldName, string | number | null>;

export function prismaEventToCsvRow(event: PrismaEvent): EventCsvRow {
  return {
    id: event.id,
    eventName: event.eventName,
    date: event.date.toISOString(),
    host: event.host,
    manager: JSON.stringify(event.manager ?? []),
    hostEmail: JSON.stringify(event.hostEmail ?? []),
    hostPhone: JSON.stringify(event.hostPhone ?? []),
    local: event.local,
    modality: event.modality,
    targetAudience: event.targetAudience,
    activityType: event.activityType,
    maxParticipants:
      event.maxParticipants === null || event.maxParticipants === undefined
        ? null
        : event.maxParticipants,
    goals: event.goals,
    period: event.period,
    contentActivities: JSON.stringify(event.contentActivities ?? []),
    developedCompetencies: event.developedCompetencies,
    initTime: event.initTime.toISOString(),
    finishTime: event.finishTime.toISOString(),
    link: event.link ?? null,
  };
}
