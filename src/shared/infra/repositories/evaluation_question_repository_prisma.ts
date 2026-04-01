import { IEvaluationQuestionRepository } from "../../domain/repositories/evaluation_question_repository_interface";
import { EvaluationQuestion } from "../../domain/entities/evaluation_question";
import { QUESTION_TYPE } from "../../domain/enums/question_type";
import { prisma } from "../../../../prisma/prisma";

export class EvaluationQuestionRepositoryPrisma
  implements IEvaluationQuestionRepository
{
  async getActiveQuestions(): Promise<EvaluationQuestion[]> {
    const questions = await prisma.evaluationQuestion.findMany({
      where: { isActive: true },
    });

    return questions.map(
      (q) =>
        new EvaluationQuestion({
          id: q.id,
          text: q.text,
          type: q.type as QUESTION_TYPE,
          isActive: q.isActive,
        })
    );
  }

  async createQuestion(
    question: EvaluationQuestion
  ): Promise<EvaluationQuestion> {
    const created = await prisma.evaluationQuestion.create({
      data: {
        text: question.text,
        type: question.type,
        isActive: question.isActive,
      },
    });

    return new EvaluationQuestion({
      id: created.id,
      text: created.text,
      type: created.type as QUESTION_TYPE,
      isActive: created.isActive,
    });
  }

  async deleteQuestion(id: string): Promise<void> {
    await prisma.evaluationQuestion.delete({ where: { id } });
  }
}
