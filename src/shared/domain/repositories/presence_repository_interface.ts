import { CompleteCertificateDTO } from "../../infra/dto/complete_certificate_dto";
import { PresencesFromEventDTO } from "../../infra/dto/presences_from_event_dto";
import { Presence } from "../entities/presence";

export interface IPresenceRepository {
  createPresence(presence: Presence): Promise<Presence>;
  getPresenceByUserAndEvent(
    userId: string,
    eventId: string
  ): Promise<Presence | null>;
  getAllPresencesByEventId(eventId: string): Promise<PresencesFromEventDTO[]>;
  getAllPresencesByUserId(userId: string): Promise<Presence[]>;
  getAllPresences(profUser: string): Promise<CompleteCertificateDTO[]>;
  getPresenceById(id: string): Promise<Presence | undefined>;
  deletePresenceById(id: string): Promise<void>;
}
