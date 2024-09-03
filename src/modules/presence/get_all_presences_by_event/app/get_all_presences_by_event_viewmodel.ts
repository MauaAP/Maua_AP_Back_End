import { PresencesFromEventDTO } from "../../../../shared/infra/dto/presences_from_event_dto"; // Importando o DTO atualizado

export class GetAllPresencesByEventViewmodel {
  presenceId: string;
  eventId: string;
  userId: string;
  date: number;
  eventName: string;
  userName: string;

  constructor(presence: PresencesFromEventDTO) {
    this.presenceId = presence.presenceId;
    this.eventId = presence.eventId;
    this.userId = presence.userId;
    this.date = presence.date;
    this.eventName = presence.eventName;
    this.userName = presence.userName;
  }
}
