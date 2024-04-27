import { Presence } from "../../../../shared/domain/entities/presence";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetAllPresencesByEventUsecase {
  constructor(private presenceRepository: IPresenceRepository) {
    this.presenceRepository = presenceRepository;
  }
  async execute(eventId: string): Promise<Presence[]> {
    try {
      const presences = await this.presenceRepository.getAllPresencesByEventId(
        eventId
      );
      return presences;
    } catch (error: any) {
        console.error("Erro ao buscar presenças por evento:", error);
        throw new Error("Erro ao buscar presenças por evento.");
    }
  }
}
