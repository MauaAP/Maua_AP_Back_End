import {
  Presence,
  PresenceProps,
} from "../../../../shared/domain/entities/presence";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";

export class CreatePresenceUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private userRepository: IUserRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(userId: string, eventId: string): Promise<Presence> {
    const user = await this.userRepository.getUserById(userId);
    const event = await this.eventRepository.getEventById(eventId);
    const presence = await this.presenceRepository.getPresenceByUserAndEvent(
      userId,
      eventId
    );

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (presence && new Date(presence.date).getTime() === currentDate.getTime()) {
      throw new Error("Presença já registrada para hoje.");
    }

    if (!user) {
      throw new Error("Usuário não registrado.");
    }
    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    const presenceProps = {
      userId,
      eventId,
      date: currentDate.getTime(),
    };

    try {
      const createdPresence = await this.presenceRepository.createPresence(
        new Presence(presenceProps)
      );

      return createdPresence;
    } catch (error) {
      console.error("Erro ao criar presença:", error);
      throw new Error("Erro ao criar presença no banco de dados.");
    }
  }
}
