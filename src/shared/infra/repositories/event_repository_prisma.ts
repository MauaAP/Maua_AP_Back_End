import { PrismaClient } from "@prisma/client";
import { EventProps } from "../../../shared/domain/entities/event";
import { IEventRepository } from "../../../shared/domain/repositories/event_repository_interface";
import { Event } from "../../domain/entities/event";
import { ROLE } from "../../domain/enums/role_enum";

const prisma = new PrismaClient();

export class EventRepositoryPrisma implements IEventRepository {
  async createEvent(eventProps: EventProps): Promise<Event> {
    try {
      console.log("Criando novo evento:", eventProps);

      const createdEventFromPrisma = await prisma.event.create({
        data: {
          eventName: eventProps.eventName,
          date: new Date(eventProps.date),
          host: eventProps.host,
          manager: eventProps.manager,
          duration: eventProps.duration,
          hostEmail: eventProps.hostEmail,
          hostPhone: eventProps.hostPhone,
          local: eventProps.local,
          modality: eventProps.modality,
          targetAudience: eventProps.targetAudience,
          activityType: eventProps.activityType,
          goals: eventProps.goals,
          contentActivities: eventProps.contentActivities,
          developedCompetencies: eventProps.developedCompetencies,
          initTime: new Date(eventProps.initTime),
          finishTime: new Date(eventProps.finishTime),
        },
      });

      const createdEvent = new Event({
        eventName: createdEventFromPrisma.eventName,
        date: createdEventFromPrisma.date.getTime(),
        host: createdEventFromPrisma.host,
        manager: createdEventFromPrisma.manager,
        duration: createdEventFromPrisma.duration,
        hostEmail: createdEventFromPrisma.hostEmail,
        hostPhone: createdEventFromPrisma.hostPhone,
        local: createdEventFromPrisma.local,
        modality: createdEventFromPrisma.modality,
        targetAudience: createdEventFromPrisma.targetAudience,
        activityType: createdEventFromPrisma.activityType,
        goals: createdEventFromPrisma.goals,
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
    }
  }

  async getAll(): Promise<Event[]> {
    try {
      console.log("Buscando todos os eventos...");

      const eventsFromPrisma = await prisma.event.findMany();

      const events = eventsFromPrisma.map((event) => {
        return new Event({
          eventName: event.eventName,
          date: event.date.getTime(),
          host: event.host,
          manager: event.manager,
          duration: event.duration,
          hostEmail: event.hostEmail,
          hostPhone: event.hostPhone,
          local: event.local,
          modality: event.modality,
          targetAudience: event.targetAudience,
          activityType: event.activityType,
          goals: event.goals,
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
    }
  }
}