import { ExternalPresence } from "@prisma/client";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IExternalPresenceRepository } from "../../../../shared/domain/repositories/external_presence_interface";
import { DuplicatedItem, NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { User } from "../../../../shared/domain/entities/user";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

interface CreateExternalPresenceUsecaseRequest {
  email: string;
  name: string;
  eventId: string;
}

interface CreateExternalPresenceUsecaseResponse {
  externalPresence: ExternalPresence;
}

export class CreateExternalPresenceUsecase {
  constructor(
    private externalPresenceRepository: IExternalPresenceRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute({
    email,
    name,
    eventId,
  }: CreateExternalPresenceUsecaseRequest): Promise<CreateExternalPresenceUsecaseResponse> {
    const event = await this.eventRepository.getEventById(eventId);

    if (!event) {
      throw new NoItemsFound("Evento não encontrado.");
    }

    if (!User.isValidEmail(email)) {
      throw new EntityError("email");
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const existingPresence =
      await this.externalPresenceRepository.findByEmailAndEvent(
        email,
        eventId,
        currentDate
      );

    if (existingPresence) {
      throw new DuplicatedItem("event");
    }

    const createdExternalPresence =
      await this.externalPresenceRepository.createExternalPresence({
        eventId,
        name,
        email,
        date: currentDate,
      });

    return { externalPresence: createdExternalPresence };
  }
}
