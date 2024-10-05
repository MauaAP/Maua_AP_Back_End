import { PrismaClient } from "@prisma/client";
import { IPresenceRepository } from "../../domain/repositories/presence_repository_interface";
import { Presence } from "../../domain/entities/presence";
import { NoItemsFound } from "../../helpers/errors/usecase_errors";
import { prisma } from "../../../../prisma/prisma";
import { CompleteCertificateDTO } from "../dto/complete_certificate_dto";
import { PresencesFromEventDTO } from "../dto/presences_from_event_dto";

export class PresenceRepositoryPrisma implements IPresenceRepository {
  async createPresence(presence: Presence): Promise<Presence> {
    try {
      console.log("Criando nova presença:", presence);

      const existingPresence = await prisma.presence.findFirst({
        where: {
          userId: presence.userId,
          eventId: presence.eventId,
          date: new Date(presence.date),
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
    } finally {
      await prisma.$disconnect();
    }
  }

  async getPresenceByUserAndEvent(
    userId: string,
    eventId: string
  ): Promise<Presence | null> {
    try {
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
    } catch (error) {
      console.error("Erro ao buscar presença por usuário e evento:", error);
      throw new Error("Erro ao buscar presença por usuário e evento.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAllPresencesByEventId(
    eventId: string
  ): Promise<PresencesFromEventDTO[]> {
    try {
      const presencesFromPrisma = await prisma.presence.findMany({
        where: {
          eventId: eventId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          event: {
            select: {
              eventName: true,
            },
          },
        },
      });

      if (presencesFromPrisma.length === 0) {
        throw new NoItemsFound("Nenhuma presença encontrada para o evento.");
      }

      const presences = presencesFromPrisma.map((presenceFromPrisma) => {
        return new PresencesFromEventDTO(
          presenceFromPrisma.id,
          presenceFromPrisma.userId,
          presenceFromPrisma.eventId,
          presenceFromPrisma.date.getTime(),
          presenceFromPrisma.event.eventName,
          presenceFromPrisma.user.name
        );
      });

      return presences;
    } catch (error) {
      console.error("Erro ao buscar presenças por evento:", error);
      throw new Error("Erro ao buscar presenças por evento.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAllPresencesByUserId(userId: string): Promise<Presence[]> {
    try {
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
    } catch (error) {
      console.error("Erro ao buscar presenças por usuário:", error);
      throw new Error("Erro ao buscar presenças por usuário.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async countPresencesByEventId(eventId: string): Promise<number> {
    try {
      const count = await prisma.presence.count({
        where: {
          eventId: eventId,
        },
      });

      return count;
    } catch (error) {
      console.error("Erro ao contar presenças por evento:", error);
      throw new Error("Erro ao contar presenças por evento.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAllPresences(profUser: string): Promise<CompleteCertificateDTO[]> {
    try {
      var presencesFromPrisma;
      if (profUser != "") {
        presencesFromPrisma = await prisma.presence.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
            event: {
              select: {
                eventName: true,
              },
            },
          },
          where: {
            user: {
              id: profUser,
            },
          },
        });
      } else {
        presencesFromPrisma = await prisma.presence.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
            event: {
              select: {
                eventName: true,
              },
            },
          },
        });
      }

      if (presencesFromPrisma.length === 0) {
        return [];
      }

      const presences = presencesFromPrisma.map((presenceFromPrisma) => {
        return new CompleteCertificateDTO(
          presenceFromPrisma.id,
          presenceFromPrisma.userId,
          presenceFromPrisma.eventId,
          presenceFromPrisma.date.getTime(),
          presenceFromPrisma.event.eventName,
          presenceFromPrisma.user.name
        );
      });

      return presences;
    } catch (error) {
      console.error("Erro ao buscar todas as presenças:", error);
      throw new Error("Erro ao buscar todas as presenças.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getPresenceById(id: string): Promise<Presence | undefined> {
    try {
      const presenceFromPrisma = await prisma.presence.findUnique({
        where: {
          id: id,
        },
      });

      if (!presenceFromPrisma) {
        return undefined;
      }

      const presence = new Presence({
        presenceId: presenceFromPrisma.id,
        userId: presenceFromPrisma.userId,
        eventId: presenceFromPrisma.eventId,
        date: presenceFromPrisma.date.getTime(),
      });

      return presence;
    } catch (error) {
      console.error("Erro ao buscar presença por ID:", error);
      throw new Error("Erro ao buscar presença por ID.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deletePresenceById(id: string): Promise<void> {
    try {
      await prisma.presence.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Erro ao deletar presença:", error);
      throw new Error("Erro ao deletar presença no banco de dados.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
