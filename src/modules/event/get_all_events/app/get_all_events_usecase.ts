import { Event } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class GetAllEventsUsecase {
  constructor(private repo: IEventRepository) {}

  async execute(): Promise<Event[]> {
    const events = this.repo.getAll();
    if (!events) {
      throw new NoItemsFound("events");
    }
    return events;
  }

  async executeEventsAfterToday(): Promise<Event[]> {
    const events = this.repo.getAll();
    if (!events) {
      throw new NoItemsFound("events");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (await events).filter(event => {
      const eventDate = new Date(Number(event.date));
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });
  }
}
