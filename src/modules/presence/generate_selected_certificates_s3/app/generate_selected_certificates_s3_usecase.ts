import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { getCertificateS3Url } from "../../../../shared/infra/repositories/certificate_repository_s3";

export class GenerateSelectedCertificatesS3Usecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private createCertificateUsecase: CreateCertificateUsecase
  ) {}

  async execute(userId: string, presenceIds: string[]) {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const validPresences = presences.filter((p: any) => presenceIds.includes(p.id));
    const results = [];
    for (const presence of validPresences) {
      try {
        await this.createCertificateUsecase.execute(presence.presenceId);
        const certificateUrl = getCertificateS3Url(presence.userId, presence.eventId);
        results.push({ presenceId: presence.presenceId, certificateUrl });
      } catch (error: any) {
        results.push({ presenceId: presence.presenceId, error: error.message });
      }
    }
    return results;
  }
}
