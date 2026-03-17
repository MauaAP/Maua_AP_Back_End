import { EventEvaluation } from "../../../../shared/domain/entities/event_evaluation";

export class CreateEvaluationViewmodel {
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
  createdAt: Date | undefined;

  constructor(evaluation: EventEvaluation) {
    this.id = evaluation.id;
    this.eventId = evaluation.eventId;
    this.userId = evaluation.userId;
    this.externalEmail = evaluation.externalEmail;
    this.createdAt = evaluation.createdAt;
    this.answers = evaluation.answers.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      rating: a.rating,
      textAnswer: a.textAnswer,
    }));
  }
}
