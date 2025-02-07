import { CompleteCertificateDTO } from "../../../../shared/infra/dto/complete_certificate_dto";

export class GetAllPresencesViewmodel {
  presenceId: string;
  eventId: string;
  userId: string;
  date: number;
  eventName: string;
  userName: string;

  constructor(presence: CompleteCertificateDTO) {
    this.presenceId = presence.presenceId;
    this.eventId = presence.eventId;
    this.userId = presence.userId;
    this.date = presence.date;
    this.eventName = presence.eventName;
    this.userName = presence.userName;
  }

  toJSON() {
    return {
      presenceId: this.presenceId,
      eventId: this.eventId,
      userId: this.userId,
      date: this.date,
      eventName: this.eventName,
      userName: this.userName,
    };
  }
}
