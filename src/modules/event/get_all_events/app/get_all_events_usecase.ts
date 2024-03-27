import { Event } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class GetAllEventsUsecase {
  constructor(private repo: IEventRepository) {}

  async execute(): Promise<Event[]> {
    const events = this.repo.getAll();
    return events;
  }
}
