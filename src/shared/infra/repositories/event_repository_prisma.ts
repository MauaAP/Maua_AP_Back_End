import { Prisma, PrismaClient } from "@prisma/client";
import { IEventRepository } from "../../../shared/domain/repositories/event_repository_interface";
import { Event } from "../../domain/entities/event";
import { MODALITY } from "../../domain/enums/modality_type";

const prisma = new PrismaClient();

export class EventRepositoryPrisma implements IEventRepository {
  async createEvent(event: Event): Promise<Event> {
    try {
      console.log("Criando novo evento:", event);

      const createdEventFromPrisma = await prisma.event.create({
        data: {
          eventName: event.eventName,
          date: new Date(event.date),
          host: event.host,
          manager: event.manager,
          hostEmail: event.hostEmail,
          hostPhone: event.hostPhone,
          local: event.local,
          modality: event.modality as string,
          targetAudience: event.targetAudience,
          activityType: event.activityType,
          goals: event.goals,
          period: event.period,
          contentActivities: event.contentActivities,
          developedCompetencies: event.developedCompetencies,
          initTime: new Date(event.initTime),
          finishTime: new Date(event.finishTime),
        },
      });

      const createdEvent = new Event({
        eventId: createdEventFromPrisma.id,
        eventName: createdEventFromPrisma.eventName,
        date: createdEventFromPrisma.date.getTime(),
        host: createdEventFromPrisma.host,
        manager: createdEventFromPrisma.manager,
        hostEmail: createdEventFromPrisma.hostEmail,
        hostPhone: createdEventFromPrisma.hostPhone,
        local: createdEventFromPrisma.local,
        modality: createdEventFromPrisma.modality as MODALITY,
        targetAudience: createdEventFromPrisma.targetAudience,
        activityType: createdEventFromPrisma.activityType,
        goals: createdEventFromPrisma.goals,
        period: createdEventFromPrisma.period,
        contentActivities: createdEventFromPrisma.contentActivities,
        developedCompetencies: createdEventFromPrisma.developedCompetencies,
        initTime: createdEventFromPrisma.initTime.getTime(),
        finishTime: createdEventFromPrisma.finishTime.getTime(),
      });

      console.log("Evento criado com sucesso:", createdEvent);

      return createdEvent;
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      throw new Error("Erro ao criar evento no banco de dados.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAll(): Promise<Event[]> {
    try {
      console.log("Buscando todos os eventos...");

      const eventsFromPrisma = await prisma.event.findMany();

      const events = eventsFromPrisma.map((event) => {
        return new Event({
          eventId: event.id,
          eventName: event.eventName,
          date: event.date.getTime(),
          host: event.host,
          manager: event.manager,
          hostEmail: event.hostEmail,
          hostPhone: event.hostPhone,
          local: event.local,
          modality: event.modality as MODALITY,
          targetAudience: event.targetAudience,
          activityType: event.activityType,
          goals: event.goals,
          period: event.period,
          contentActivities: event.contentActivities,
          developedCompetencies: event.developedCompetencies,
          initTime: event.initTime.getTime(),
          finishTime: event.finishTime.getTime(),
        });
      });

      console.log("Eventos encontrados:", events);

      return events;
    } catch (error: any) {
      console.error("Erro ao buscar eventos:", error);
      throw new Error("Erro ao buscar eventos no banco de dados.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      console.log("Buscando evento por ID:", eventId);

      const eventFromPrisma = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!eventFromPrisma) {
        console.error(`Evento não encontrado para o ID: ${eventId}`);
        throw new Error("Evento não encontrado.");
      }

      const event = new Event({
        eventId: eventFromPrisma.id,
        eventName: eventFromPrisma.eventName,
        date: eventFromPrisma.date.getTime(),
        host: eventFromPrisma.host,
        manager: eventFromPrisma.manager,
        hostEmail: eventFromPrisma.hostEmail,
        hostPhone: eventFromPrisma.hostPhone,
        local: eventFromPrisma.local,
        modality: eventFromPrisma.modality as MODALITY,
        targetAudience: eventFromPrisma.targetAudience,
        activityType: eventFromPrisma.activityType,
        goals: eventFromPrisma.goals,
        period: eventFromPrisma.period,
        contentActivities: eventFromPrisma.contentActivities,
        developedCompetencies: eventFromPrisma.developedCompetencies,
        initTime: eventFromPrisma.initTime.getTime(),
        finishTime: eventFromPrisma.finishTime.getTime(),
      });

      console.log("Evento encontrado:", event);

      return event;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(
          "Erro conhecido do Prisma ao buscar evento por ID:",
          error.message
        );
        throw new Error("Erro no banco de dados ao buscar evento por ID.");
      } else if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error("Erro de inicialização do Prisma:", error.message);
        throw new Error("Erro de inicialização do banco de dados.");
      } else {
        console.error("Erro desconhecido ao buscar evento por ID:", error);
        throw new Error(
          `Erro ao buscar evento por ID no banco de dados: ${error.message}`
        );
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(eventId: string): Promise<void> {
    try {
      console.log("Deletando evento por ID:", eventId);

      await prisma.event.delete({
        where: {
          id: eventId,
        },
      });

      console.log("Evento deletado com sucesso.");
    } catch (error: any) {
      console.error("Erro ao deletar evento por ID:", error);
      throw new Error("Erro ao deletar evento por ID no banco de dados.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
