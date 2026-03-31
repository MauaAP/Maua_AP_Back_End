import { EvaluationQuestion } from "../../../../shared/domain/entities/evaluation_question";
import { IEventQuestionnaireRepository } from "../../../../shared/domain/repositories/event_questionnaire_repository_interface";
import { prisma } from "../../../../../prisma/prisma";

export class GetEventEvaluationQuestionsUsecase {
  constructor(private questionnaireRepository: IEventQuestionnaireRepository) {}

  async execute(eventId: string): Promise<EvaluationQuestion[]> {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return this.questionnaireRepository.findQuestionsForEventForm(eventId);
  }
}
