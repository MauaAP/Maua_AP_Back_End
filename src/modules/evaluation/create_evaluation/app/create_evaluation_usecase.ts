import { EventEvaluation } from "../../../../shared/domain/entities/event_evaluation";
import { EvaluationAnswer } from "../../../../shared/domain/entities/evaluation_answer";
import { IEventEvaluationRepository } from "../../../../shared/domain/repositories/event_evaluation_repository_interface";
import { prisma } from "../../../../../prisma/prisma";

interface AnswerInput {
  questionId: string;
  rating?: number | null;
  textAnswer?: string | null;
}

interface CreateEvaluationInput {
  eventId: string;
  userId?: string;
  externalEmail?: string;
  answers: AnswerInput[];
}

export class CreateEvaluationUsecase {
  constructor(private repository: IEventEvaluationRepository) {}

  async execute(input: CreateEvaluationInput): Promise<EventEvaluation> {
    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
    });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

    if (new Date() < event.finishTime) {
      throw new Error("O evento ainda não foi finalizado");
    }

    if (input.userId) {
      const presence = await prisma.presence.findFirst({
        where: { eventId: input.eventId, userId: input.userId },
      });

      if (!presence) {
        throw new Error("Usuário não possui presença confirmada neste evento");
      }

      const existing = await this.repository.getEvaluationByUserAndEvent(
        input.eventId,
        input.userId
      );
      if (existing) {
        throw new Error("Usuário já avaliou este evento");
      }
    } else if (input.externalEmail) {
      const externalPresence = await prisma.externalPresence.findFirst({
        where: { eventId: input.eventId, email: input.externalEmail },
      });

      if (!externalPresence) {
        throw new Error(
          "Convidado externo não possui presença confirmada neste evento"
        );
      }

      const existing =
        await this.repository.getEvaluationByExternalEmailAndEvent(
          input.eventId,
          input.externalEmail
        );
      if (existing) {
        throw new Error("Convidado externo já avaliou este evento");
      }
    }

    if (!input.answers || input.answers.length === 0) {
      throw new Error("É necessário enviar ao menos uma resposta");
    }

    const answers = input.answers.map(
      (a) =>
        new EvaluationAnswer({
          evaluationId: "",
          questionId: a.questionId,
          rating: a.rating,
          textAnswer: a.textAnswer,
        })
    );

    const evaluation = new EventEvaluation({
      eventId: input.eventId,
      userId: input.userId ?? null,
      externalEmail: input.externalEmail ?? null,
      answers,
    });

    return this.repository.createEvaluation(evaluation);
  }
}
