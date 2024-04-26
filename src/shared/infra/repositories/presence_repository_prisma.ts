import { PrismaClient } from "@prisma/client";
import { IPresenceRepository } from "../../domain/repositories/presence_repository_interface";
import { Presence } from "../../domain/entities/presence";

const prisma = new PrismaClient();

export class PresenceRepositoryPrisma implements IPresenceRepository {
  async createPresence(presence: Presence): Promise<Presence> {
    try {
      console.log("Criando nova presença:", presence);

      const existingPresence = await prisma.presence.findUnique({
        where: {
          eventId_userId: {
            eventId: presence.eventId,
            userId: presence.userId,
          },
        },
      });

      if (existingPresence) {
        console.error("Já existe uma presença cadastrada para este evento e usuário.");
        throw new Error("Já existe uma presença cadastrada para este evento e usuário.");
      }

      const createdPresenceFromPrisma = await prisma.presence.create({
        data: {
          user: {
            connect: {
              id: presence.userId,
            },
          },
          event: {
            connect: {
              id: presence.eventId,
            },
          },
          date: new Date(presence.date),
        },
      });

      const createdPresence = new Presence({
        userId: createdPresenceFromPrisma.userId,
        eventId: createdPresenceFromPrisma.eventId,
        date: createdPresenceFromPrisma.date.getTime(),
      });

      console.log("Presença criada com sucesso:", createdPresence);

      return createdPresence;
    } catch (error) {
      console.error("Erro ao criar presença:", error);
      throw new Error("Erro ao criar presença no banco de dados.");
    }
  }
}