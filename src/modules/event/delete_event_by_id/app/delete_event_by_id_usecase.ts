import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class DeleteEventByIdUsecase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(eventId: string): Promise<void> {
    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new NoItemsFound("event");
    }

    await this.eventRepository.delete(eventId);
  }
}
