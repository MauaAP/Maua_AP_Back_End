import { Event } from "../entities/event";

export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  getAll(): Promise<Event[]>;
  getEventById(id: String): Promise<Event>;
}
