import { GetEvaluationsByEventResult } from "./get_evaluations_by_event_usecase";

export class GetEvaluationsByEventViewmodel {
  evaluations: {
    id: string;
    eventId: string;
    userName: string | null;
    userEmail: string | null;
    externalEmail: string | null;
    createdAt: Date;
    updatedAt: Date;
    answers: {
      questionId: string;
      questionText: string;
      questionType: string;
      rating: number | null;
      textAnswer: string | null;
    }[];
  }[];

  constructor(result: GetEvaluationsByEventResult) {
    this.evaluations = result.evaluations;
  }
}
