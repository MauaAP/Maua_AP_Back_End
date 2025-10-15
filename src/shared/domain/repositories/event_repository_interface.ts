import { Event } from "../entities/event";

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  getAll(): Promise<Event[]>;
  getEventById(id: String): Promise<Event>;
  delete(id: String): Promise<void>;
  updateDevelopedCompetencies(eventId: string, developedCompetencies: string): Promise<void>;
  updateEvent(eventId: string, event: Event): Promise<Event>;
}
