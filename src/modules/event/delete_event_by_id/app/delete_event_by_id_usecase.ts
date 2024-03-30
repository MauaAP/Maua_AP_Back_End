import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class DeleteEventByIdUsecase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(eventId: string): Promise<void> {
    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    await this.eventRepository.delete(eventId);
  }
}
