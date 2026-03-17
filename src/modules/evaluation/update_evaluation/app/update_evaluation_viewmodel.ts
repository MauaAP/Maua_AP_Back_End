import { EventEvaluation } from "../../../../shared/domain/entities/event_evaluation";

export class UpdateEvaluationViewmodel {
  id: string;
  eventId: string;
  userId: string | null | undefined;
  externalEmail: string | null | undefined;
  answers: {
    id: string;
    questionId: string;
    rating: number | null | undefined;
    textAnswer: string | null | undefined;
  }[];
  updatedAt: Date | undefined;

  constructor(evaluation: EventEvaluation) {
    this.id = evaluation.id;
    this.eventId = evaluation.eventId;
    this.userId = evaluation.userId;
    this.externalEmail = evaluation.externalEmail;
    this.updatedAt = evaluation.updatedAt;
    this.answers = evaluation.answers.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      rating: a.rating,
      textAnswer: a.textAnswer,
    }));
  }
}
