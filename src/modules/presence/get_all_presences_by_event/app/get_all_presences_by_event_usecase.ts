import { PresencesFromEventDTO } from "../../../../shared/infra/dto/presences_from_event_dto";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetAllPresencesByEventUsecase {
  constructor(private presenceRepository: IPresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  async execute(eventId: string): Promise<PresencesFromEventDTO[]> {
    try {
      const presencesDTO =
        await this.presenceRepository.getAllPresencesByEventId(eventId);
      return presencesDTO;
    } catch (error: any) {
      console.error("Erro ao buscar presenças por evento:", error);
      throw new Error("Erro ao buscar presenças por evento.");
    }
  }
}
