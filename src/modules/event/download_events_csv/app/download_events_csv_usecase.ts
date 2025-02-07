import { Event } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class DownloadEventsCsvUsecase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(): Promise<Event[]> {
    const events = await this.eventRepository.getAll();
    if (!events) {
      throw new NoItemsFound("events");
    }
    return events;
  }
}
