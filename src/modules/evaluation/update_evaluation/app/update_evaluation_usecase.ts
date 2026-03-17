import { EventEvaluation } from "../../../../shared/domain/entities/event_evaluation";
import { EvaluationAnswer } from "../../../../shared/domain/entities/evaluation_answer";
import { IEventEvaluationRepository } from "../../../../shared/domain/repositories/event_evaluation_repository_interface";

interface AnswerInput {
  questionId: string;
  rating?: number | null;
  textAnswer?: string | null;
}

interface UpdateEvaluationInput {
  evaluationId: string;
  userId?: string;
  externalEmail?: string;
  answers: AnswerInput[];
}

export class UpdateEvaluationUsecase {
  constructor(private repository: IEventEvaluationRepository) {}

  async execute(input: UpdateEvaluationInput): Promise<EventEvaluation> {
    const existing = await this.repository.getEvaluationById(
      input.evaluationId
    );

    if (!existing) {
      throw new Error("Avaliação não encontrada");
    }

    if (input.userId && existing.userId !== input.userId) {
      throw new Error("Você não tem permissão para editar esta avaliação");
    }

    if (
      input.externalEmail &&
      existing.externalEmail !== input.externalEmail
    ) {
      throw new Error("Você não tem permissão para editar esta avaliação");
    }

    if (!input.answers || input.answers.length === 0) {
      throw new Error("É necessário enviar ao menos uma resposta");
    }

    const answers = input.answers.map(
      (a) =>
        new EvaluationAnswer({
          evaluationId: input.evaluationId,
          questionId: a.questionId,
          rating: a.rating,
          textAnswer: a.textAnswer,
        })
    );

    const updatedEvaluation = new EventEvaluation({
      id: existing.id,
      eventId: existing.eventId,
      userId: existing.userId,
      externalEmail: existing.externalEmail,
      answers,
    });

    return this.repository.updateEvaluation(updatedEvaluation);
  }
}
