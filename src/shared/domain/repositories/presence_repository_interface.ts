import { Presence } from "../entities/presence";

export interface IPresenceRepository {
    createPresence(presence: Presence): Promise<Presence>;
    getPresenceByUserAndEvent(userId: string, eventId: string): Promise<Presence | null>;
    // getPresenceById(id: string): Promise<Presence | undefined>;
    // getAll(): Promise<Presence[]>;
    // getPresenceByEventId(eventId: string): Promise<Presence[]>;
    // getPresenceByUserId(userId: string): Promise<Presence[]>;
    // deletePresence(id: string): Promise<void>;
    // updatePresence(presence: Presence): Promise<Presence>;
}