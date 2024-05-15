import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetAllPresencesUsecase {
  constructor(private presenceRepository: IPresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  async execute() {
    try {
      const presences = await this.presenceRepository.getAllPresences();
      return presences;
    } catch (error) {
      console.error("Erro ao buscar presenças:", error);
      throw new Error("Erro ao buscar presenças no banco de dados.");
    }
  }
}
