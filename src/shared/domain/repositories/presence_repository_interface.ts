import { CompleteCertificateDTO } from "../../infra/dto/complete_certificate_dto";
import { Presence } from "../entities/presence";

export interface IPresenceRepository {
    createPresence(presence: Presence): Promise<Presence>;
    getPresenceByUserAndEvent(userId: string, eventId: string): Promise<Presence | null>;
    getAllPresencesByEventId(eventId: string): Promise<Presence[]>;
    getAllPresencesByUserId(userId: string): Promise<Presence[]>;
    getAllPresences(): Promise<CompleteCertificateDTO[]>;
    getPresenceById(id: string): Promise<Presence | undefined>;
    deletePresenceById(id: string): Promise<void>;
}