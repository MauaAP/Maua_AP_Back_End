import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { getCertificateS3Url } from "../../../../shared/infra/repositories/certificate_repository_s3";

export class ListCertificatesS3Usecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(userId: string, orderBy?: string) {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const certificates = await Promise.all(
      presences.map(async (presence: any) => {
        const event = await this.eventRepository.getEventById(presence.eventId);
        const certificateUrl = getCertificateS3Url(presence.userId, presence.eventId);
        return {
          presenceId: presence.id,
          eventName: event.eventName,
          eventDate: event.date,
          certificateUrl,
        };
      })
    );
    if (orderBy === "date") {
      certificates.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (orderBy === "event") {
      certificates.sort((a, b) => a.eventName.localeCompare(b.eventName));
    }
    return certificates;
  }
}
