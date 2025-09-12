import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";

export class GenerateAllCertificatesUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private createCertificateUsecase: CreateCertificateUsecase
  ) {}

  async execute(userId: string) {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const results = [];
    for (const presence of presences) {
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
