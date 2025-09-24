import {
  Presence,
  PresenceProps,
} from "../../../../shared/domain/entities/presence";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import axios from "axios";

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

      try {
        await axios.post(
          'https://2l94ticpqf.execute-api.sa-east-1.amazonaws.com/prod/click-car/discord-send?topic=login&bot=benchimol',
          {
            message: `ATENÇÃO: usuário ${user.name} criou uma presença no evento ${event.eventName}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'clickcar-test-key-123',
            },
          }
        );
      } catch (err) {
        console.log('Erro ao enviar mensagem Discord:', err && typeof err === 'object' && 'message' in err ? (err as any).message : String(err));
      }

      return createdPresence;
    } catch (error) {
      console.error("Erro ao criar presença:", error);
      throw new Error("Erro ao criar presença no banco de dados.");
    }
  }
}
