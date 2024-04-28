import { PrismaClient } from "@prisma/client";
import { IPresenceRepository } from "../../domain/repositories/presence_repository_interface";
import { Presence } from "../../domain/entities/presence";
import { NoItemsFound } from "../../helpers/errors/usecase_errors";

const prisma = new PrismaClient();

export class PresenceRepositoryPrisma implements IPresenceRepository {
  async createPresence(presence: Presence): Promise<Presence> {
    try {
      console.log("Criando nova presença:", presence);

      // Check if a presence with the same eventId, userId, and date already exists
      const existingPresence = await prisma.presence.findUnique({
        where: {
          eventId_userId_date: {
            eventId: presence.eventId,
            userId: presence.userId,
            date: new Date(presence.date),
          },
        },
      });

      if (existingPresence) {
        console.error(
          "Já existe uma presença cadastrada para este evento, usuário, e data."
        );
        throw new Error(
          "Já existe uma presença cadastrada para este evento, usuário, e data."
        );
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
        presenceId: createdPresenceFromPrisma.id,
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

  async getPresenceByUserAndEvent(
    userId: string,
    eventId: string
  ): Promise<Presence | null> {
    const presenceFromPrisma = await prisma.presence.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (!presenceFromPrisma) {
      return null;
    }

    const presence = new Presence({
      presenceId: presenceFromPrisma.id,
      userId: presenceFromPrisma.userId,
      eventId: presenceFromPrisma.eventId,
      date: presenceFromPrisma.date.getTime(),
    });

    return presence;
  }

  async getAllPresencesByEventId(eventId: string): Promise<Presence[]> {
    const presencesFromPrisma = await prisma.presence.findMany({
      where: {
        eventId: eventId,
      },
    });

    if (presencesFromPrisma.length === 0) {
      throw new NoItemsFound("Nenhuma presença encontrada para o evento.");
    }

    const presences = presencesFromPrisma.map((presenceFromPrisma) => {
      return new Presence({
        presenceId: presenceFromPrisma.id,
        userId: presenceFromPrisma.userId,
        eventId: presenceFromPrisma.eventId,
        date: presenceFromPrisma.date.getTime(),
      });
    });

    return presences;
  }

  async getAllPresencesByUserId(userId: string): Promise<Presence[]> {
    const presencesFromPrisma = await prisma.presence.findMany({
      where: {
        userId: userId,
      },
    });

    if (presencesFromPrisma.length === 0) {
      throw new NoItemsFound("Nenhuma presença encontrada para o usuário.");
    }

    const presences = presencesFromPrisma.map((presenceFromPrisma) => {
      return new Presence({
        presenceId: presenceFromPrisma.id,
        userId: presenceFromPrisma.userId,
        eventId: presenceFromPrisma.eventId,
        date: presenceFromPrisma.date.getTime(),
      });
    });

    return presences;
  }
}
