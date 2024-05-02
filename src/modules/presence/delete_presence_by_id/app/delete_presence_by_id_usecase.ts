import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class DeletePresenceByIdUsecase {
    constructor(private presenceRepository: IPresenceRepository) {
        this.presenceRepository = presenceRepository;
    }
    async execute(presenceId: string) {
        try {
            await this.presenceRepository.deletePresenceById(presenceId);
        }
        catch (error) {
            throw new Error("Erro ao deletar presença.");
        }
    }
}