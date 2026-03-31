import { prisma } from "../../../../prisma/prisma";
import { EvaluationQuestion } from "../../domain/entities/evaluation_question";
import { QUESTION_TYPE } from "../../domain/enums/question_type";
import { IEventQuestionnaireRepository } from "../../domain/repositories/event_questionnaire_repository_interface";

function mapQuestion(row: {
  id: string;
  text: string;
  type: string;
  isActive: boolean;
}): EvaluationQuestion {
  return new EvaluationQuestion({
    id: row.id,
    text: row.text,
    type: row.type as QUESTION_TYPE,
    isActive: row.isActive,
  });
}

export class EventQuestionnaireRepositoryPrisma
  implements IEventQuestionnaireRepository
{
  async findQuestionsForEventForm(
    eventId: string
  ): Promise<EvaluationQuestion[]> {
    const items = await prisma.eventQuestionnaire.findMany({
      where: { eventId },
      include: { question: true },
      orderBy: { displayOrder: "asc" },
    });

    if (items.length === 0) {
      const all = await prisma.evaluationQuestion.findMany({
        where: { isActive: true },
        orderBy: { text: "asc" },
      });
      return all.map((q) => mapQuestion(q));
    }

    return items
      .filter((i) => i.question.isActive)
      .map((i) => mapQuestion(i.question));
  }

  async getAllowedActiveQuestionIdsForEvent(
    eventId: string
  ): Promise<string[]> {
    const items = await prisma.eventQuestionnaire.findMany({
      where: { eventId },
      select: { questionId: true },
    });

    if (items.length === 0) {
      const all = await prisma.evaluationQuestion.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      return all.map((q) => q.id);
    }

    const qids = items.map((i) => i.questionId);
    const active = await prisma.evaluationQuestion.findMany({
      where: { id: { in: qids }, isActive: true },
      select: { id: true },
    });
    return active.map((q) => q.id);
  }

  async replaceQuestionnaire(
    eventId: string,
    questionIds: string[]
  ): Promise<void> {
    const unique = [...new Set(questionIds)];

    if (unique.length > 0) {
      const found = await prisma.evaluationQuestion.findMany({
        where: { id: { in: unique }, isActive: true },
        select: { id: true },
      });
      const foundSet = new Set(found.map((f) => f.id));
      const missing = unique.filter((id) => !foundSet.has(id));
      if (missing.length > 0) {
        throw new Error(
          `Pergunta(s) inválida(s) ou inativa(s): ${missing.join(", ")}`
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.eventQuestionnaire.deleteMany({ where: { eventId } });
      if (unique.length > 0) {
        await tx.eventQuestionnaire.createMany({
          data: unique.map((questionId, displayOrder) => ({
            eventId,
            questionId,
            displayOrder,
          })),
        });
      }
    });
  }
}
