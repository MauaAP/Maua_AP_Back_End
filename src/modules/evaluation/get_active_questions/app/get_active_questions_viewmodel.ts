import { EvaluationQuestion } from "../../../../shared/domain/entities/evaluation_question";

export class GetActiveQuestionsViewmodel {
  questions: {
    id: string;
    text: string;
    type: string;
  }[];

  constructor(questions: EvaluationQuestion[]) {
    this.questions = questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
    }));
  }
}
