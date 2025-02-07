import { ExternalPresence, Prisma } from "@prisma/client";

export interface IExternalPresenceRepository {
  createExternalPresence(data: Prisma.ExternalPresenceUncheckedCreateInput): Promise<ExternalPresence>;
  findByEmailAndEvent(email: string, eventId: string, date: Date): Promise<ExternalPresence | null>;
  getExternalPresenceById(id: string): Promise<ExternalPresence | null>
}
