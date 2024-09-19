import { ExternalPresence, Prisma } from "@prisma/client";

export interface IExternalPresenceInterface {
  createExternalPresence(
    data: Prisma.ExternalPresenceUncheckedCreateInput
  ): Promise<ExternalPresence>;
}
