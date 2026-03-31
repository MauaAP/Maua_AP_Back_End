import { IEventQuestionnaireRepository } from "../../../../shared/domain/repositories/event_questionnaire_repository_interface";
import { prisma } from "../../../../../prisma/prisma";

interface EvaluationAnswerDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  rating: number | null;
  textAnswer: string | null;
}

interface EvaluationDetail {
  id: string;
  eventId: string;
  userName: string | null;
  userEmail: string | null;
  externalEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  answers: EvaluationAnswerDetail[];
}

export interface GetEvaluationsByEventResult {
  evaluations: EvaluationDetail[];
}

export class GetEvaluationsByEventUsecase {
  constructor(
    private questionnaireRepository: IEventQuestionnaireRepository
  ) {}

  async execute(eventId: string): Promise<GetEvaluationsByEventResult> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

    const allowedQuestionIds = new Set(
      await this.questionnaireRepository.getAllowedActiveQuestionIdsForEvent(
        eventId
      )
    );

    const evaluations = await prisma.eventEvaluation.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          include: {
            question: { select: { text: true, type: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped: EvaluationDetail[] = evaluations.map((e) => ({
      id: e.id,
      eventId: e.eventId,
      userName: e.user?.name ?? null,
      userEmail: e.user?.email ?? null,
      externalEmail: e.externalEmail,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      answers: e.answers
        .filter((a) => allowedQuestionIds.has(a.questionId))
        .map((a) => ({
          questionId: a.questionId,
          questionText: a.question.text,
          questionType: a.question.type,
          rating: a.rating,
          textAnswer: a.textAnswer,
        })),
    }));

    return { evaluations: mapped };
  }
}
