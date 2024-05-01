import { Presence } from "../entities/presence";

export interface IPresenceRepository {
    createPresence(presence: Presence): Promise<Presence>;
    getPresenceByUserAndEvent(userId: string, eventId: string): Promise<Presence | null>;
    getAllPresencesByEventId(eventId: string): Promise<Presence[]>;
    getAllPresencesByUserId(userId: string): Promise<Presence[]>;
    getPresenceById(id: string): Promise<Presence | undefined>;
    // getAll(): Promise<Presence[]>;
    // deletePresenceById(id: string): Promise<void>;
}