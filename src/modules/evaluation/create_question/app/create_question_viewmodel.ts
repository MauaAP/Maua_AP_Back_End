import { EvaluationQuestion } from "../../../../shared/domain/entities/evaluation_question";

export class CreateQuestionViewmodel {
  id: string;
  text: string;
  type: string;
  isActive: boolean;

  constructor(question: EvaluationQuestion) {
    this.id = question.id;
    this.text = question.text;
    this.type = question.type;
    this.isActive = question.isActive;
  }
}
