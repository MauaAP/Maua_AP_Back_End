import { Event } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class GetEventByIdUsecase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string): Promise<Event> {
    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }
    return event;
  }
}
