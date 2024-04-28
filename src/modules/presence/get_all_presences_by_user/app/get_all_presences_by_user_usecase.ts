import { Presence } from "../../../../shared/domain/entities/presence";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetAllPresencesByUserUsecase {
  constructor(private presenceRepository: IPresenceRepository) {
    this.presenceRepository = presenceRepository;
  }
  async execute(userId: string): Promise<Presence[]> {
    try {
      const presences = await this.presenceRepository.getAllPresencesByUserId(
        userId
      );
      return presences;
    } catch (error: any) {
      console.error("Erro ao buscar presenças por usuário:", error);
      throw new Error("Erro ao buscar presenças por usuário.");
    }
  }
}
