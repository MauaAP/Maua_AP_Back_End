import { IEventQuestionnaireRepository } from "../../../../shared/domain/repositories/event_questionnaire_repository_interface";
import { prisma } from "../../../../../prisma/prisma";

export class SetEventQuestionnaireUsecase {
  constructor(private questionnaireRepository: IEventQuestionnaireRepository) {}

  async execute(eventId: string, questionIds: string[]): Promise<void> {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    await this.questionnaireRepository.replaceQuestionnaire(eventId, questionIds);
  }
}
