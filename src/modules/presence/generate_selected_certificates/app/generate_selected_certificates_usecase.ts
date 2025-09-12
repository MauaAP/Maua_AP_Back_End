import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";

export class GenerateSelectedCertificatesUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private createCertificateUsecase: CreateCertificateUsecase
  ) {}

  async execute(userId: string, presenceIds: string[]) {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const validPresences = presences.filter((p: any) => presenceIds.includes(p.presenceId));
    const results = [];
    for (const presence of validPresences) {
      try {
        const certificateUrl = await this.createCertificateUsecase.execute(presence.presenceId);
        results.push({ presenceId: presence.presenceId, certificateUrl });
      } catch (error: any) {
        results.push({ presenceId: presence.presenceId, error: error.message });
      }
    }
    return results;
  }
}
