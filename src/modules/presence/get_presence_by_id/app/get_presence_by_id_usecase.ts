import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetPresenceByIdUsecase {
  constructor(private presenceRepository: IPresenceRepository) {}
  
  async execute(presenceId: string) {
    try {
      const presence = await this.presenceRepository.getPresenceById(
        presenceId
      );
      return presence;
    } catch (error: any) {
      console.error("Erro ao buscar presença por ID:", error);
      throw new Error("Erro ao buscar presença por ID no banco de dados.");
    }
  }
}
