import { ExternalPresence, Prisma } from "@prisma/client";
import { IExternalPresenceRepository } from "../../domain/repositories/external_presence_interface";
import { prisma } from "../../../../prisma/prisma";

export class ExternalPresenceRepositoryPrisma
  implements IExternalPresenceRepository
{
  async createExternalPresence(
    data: Prisma.ExternalPresenceUncheckedCreateInput
  ): Promise<ExternalPresence> {
    try {
      console.log("Criando nova presença externa:", data);

      const existingPresence = await prisma.externalPresence.findFirst({
        where: {
          email: data.email,
          eventId: data.eventId,
          date: new Date(data.date),
        },
      });

      if (existingPresence) {
        console.error(
          "Já existe uma presença externa cadastrada para este evento, email, e data."
        );
        throw new Error(
          "Já existe uma presença externa cadastrada para este evento, email, e data."
        );
      }

      const createdPresence = await prisma.externalPresence.create({
        data: {
          event: {
            connect: {
              id: data.eventId,
            },
          },
          name: data.name,
          email: data.email,
          date: new Date(data.date),
        },
      });

      console.log("Presença externa criada com sucesso:", createdPresence);

      return createdPresence;
    } catch (error) {
      console.error("Erro ao criar presença externa:", error);
      throw new Error("Erro ao criar presença externa no banco de dados.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByEmailAndEvent(
    email: string,
    eventId: string,
    date: Date
  ): Promise<ExternalPresence | null> {
    const startOfTheDay = new Date(date);
    startOfTheDay.setHours(0, 0, 0, 0);

    const endOfTheDay = new Date(date);
    endOfTheDay.setHours(23, 59, 59, 999);

    const externalPresence = await prisma.externalPresence.findFirst({
      where: {
        email,
        eventId,
        date: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    return externalPresence;
  }

  async getExternalPresenceById(id: string): Promise<ExternalPresence | null> {
    try {
      const externalPresence = await prisma.externalPresence.findUnique({
        where: {
          id,
        },
      });
      return externalPresence;
    } catch (error) {
      console.error("Erro ao buscar presença externa:", error);
      throw new Error("Erro ao buscar presença externa no banco de dados.");
    }
  }
}
