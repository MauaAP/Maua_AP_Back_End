import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class UpdateEventCompetenciesUsecase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string, developedCompetencies: string) {
    // Atualiza o campo developedCompetencies do evento
    await this.eventRepository.updateDevelopedCompetencies(eventId, developedCompetencies);
  }
}
