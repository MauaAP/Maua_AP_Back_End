/**
 * Smoke check: mapper produz exatamente as colunas documentadas (sem DB).
 * npm run verify:event-csv
 */
import type { Event as PrismaEvent } from "@prisma/client";
import {
  EVENT_CSV_FIELD_NAMES,
  prismaEventToCsvRow,
} from "../src/shared/utils/event_csv_export_mapper";

const mock = {
  id: "00000000-0000-4000-8000-000000000001",
  eventName: "Evento teste",
  date: new Date("2020-01-15T12:00:00.000Z"),
  host: "Host",
  manager: ["A", "B"],
  hostEmail: ["a@x.com"],
  hostPhone: ["11999999999"],
  local: "Local",
  modality: "PRESENCIAL",
  targetAudience: "Docentes",
  activityType: "workshop",
  maxParticipants: 30,
  goals: "Objetivos",
  period: "2020",
  contentActivities: ["Atividade 1"],
  developedCompetencies: "CTr 1",
  initTime: new Date("2020-01-15T14:00:00.000Z"),
  finishTime: new Date("2020-01-15T18:00:00.000Z"),
  link: null,
} as PrismaEvent;

const row = prismaEventToCsvRow(mock);
for (const field of EVENT_CSV_FIELD_NAMES) {
  if (!(field in row)) {
    console.error(`Campo ausente na linha CSV: ${field}`);
    process.exit(1);
  }
}
console.log("verify:event-csv OK —", EVENT_CSV_FIELD_NAMES.length, "colunas");
