import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class ListCertificatesUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(userId: string, orderBy?: string) {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const certificates = await Promise.all(
      presences.map(async (presence: any) => {
        const event = await this.eventRepository.getEventById(presence.eventId);
        return {
          presenceId: presence.id,
          eventName: event.eventName,
          eventDate: event.date,
          certificateUrl: presence.certificateUrl || null,
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
