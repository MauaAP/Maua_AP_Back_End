import { Event } from "../entities/event";
import type { EventCsvRow } from "../../utils/event_csv_export_mapper";

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  getAll(): Promise<Event[]>;
  findAllForCsvExport(): Promise<EventCsvRow[]>;
  getEventById(id: String): Promise<Event>;
  delete(id: String): Promise<void>;
  updateDevelopedCompetencies(eventId: string, developedCompetencies: string): Promise<void>;
  updateEvent(eventId: string, event: Event): Promise<Event>;
}
