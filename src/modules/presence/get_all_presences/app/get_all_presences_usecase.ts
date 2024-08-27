import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";

export class GetAllPresencesUsecase {
  constructor(private presenceRepository: IPresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  async execute() {
    const presences = await this.presenceRepository.getAllPresences();
    return presences;
  }
}
