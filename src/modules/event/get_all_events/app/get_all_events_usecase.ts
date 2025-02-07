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
}
