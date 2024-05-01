import { Presence } from "../../../../shared/domain/entities/presence";

export class GetPresencesByIdViewmodel {
  presenceId: string;
  eventId: string;
  userId: string;
  date: number;

  constructor(presence: Presence) {
    this.presenceId = presence.presenceId;
    this.eventId = presence.eventId;
    this.userId = presence.userId;
    this.date = presence.date;
  }
}
