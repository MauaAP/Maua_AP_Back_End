import { IEventEvaluationRepository } from "../../domain/repositories/event_evaluation_repository_interface";
import { EventEvaluation } from "../../domain/entities/event_evaluation";
import { EvaluationAnswer } from "../../domain/entities/evaluation_answer";
import { prisma } from "../../../../prisma/prisma";

function mapPrismaToEntity(record: any): EventEvaluation {
  const answers = (record.answers ?? []).map(
    (a: any) =>
      new EvaluationAnswer({
        id: a.id,
        evaluationId: a.evaluationId,
        questionId: a.questionId,
        rating: a.rating,
        textAnswer: a.textAnswer,
      })
  );

  return new EventEvaluation({
    id: record.id,
    eventId: record.eventId,
    userId: record.userId,
    externalEmail: record.externalEmail,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    answers,
  });
}

export class EventEvaluationRepositoryPrisma
  implements IEventEvaluationRepository
{
  async createEvaluation(
    evaluation: EventEvaluation
  ): Promise<EventEvaluation> {
    const created = await prisma.eventEvaluation.create({
      data: {
        eventId: evaluation.eventId,
        userId: evaluation.userId ?? undefined,
        externalEmail: evaluation.externalEmail ?? undefined,
        answers: {
          create: evaluation.answers.map((a) => ({
            questionId: a.questionId,
            rating: a.rating ?? null,
            textAnswer: a.textAnswer ?? null,
          })),
        },
      },
      include: { answers: true },
    });

    return mapPrismaToEntity(created);
  }

  async updateEvaluation(
    evaluation: EventEvaluation
  ): Promise<EventEvaluation> {
    await prisma.evaluationAnswer.deleteMany({
      where: { evaluationId: evaluation.id },
    });

    const updated = await prisma.eventEvaluation.update({
      where: { id: evaluation.id },
      data: {
        answers: {
          create: evaluation.answers.map((a) => ({
            questionId: a.questionId,
            rating: a.rating ?? null,
            textAnswer: a.textAnswer ?? null,
          })),
        },
      },
      include: { answers: true },
    });

    return mapPrismaToEntity(updated);
  }

  async getEvaluationsByEventId(
    eventId: string
  ): Promise<EventEvaluation[]> {
    const evaluations = await prisma.eventEvaluation.findMany({
      where: { eventId },
      include: {
        answers: {
          include: { question: true },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return evaluations.map((e) => mapPrismaToEntity(e));
  }

  async getEvaluationByUserAndEvent(
    eventId: string,
    userId: string
  ): Promise<EventEvaluation | null> {
    const evaluation = await prisma.eventEvaluation.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
      include: { answers: true },
    });

    return evaluation ? mapPrismaToEntity(evaluation) : null;
  }

  async getEvaluationByExternalEmailAndEvent(
    eventId: string,
    externalEmail: string
  ): Promise<EventEvaluation | null> {
    const evaluation = await prisma.eventEvaluation.findUnique({
      where: {
        eventId_externalEmail: { eventId, externalEmail },
      },
      include: { answers: true },
    });

    return evaluation ? mapPrismaToEntity(evaluation) : null;
  }

  async getEvaluationById(id: string): Promise<EventEvaluation | null> {
    const evaluation = await prisma.eventEvaluation.findUnique({
      where: { id },
      include: { answers: true },
    });

    return evaluation ? mapPrismaToEntity(evaluation) : null;
  }
}
