import { EvaluationQuestion } from "../../../../shared/domain/entities/evaluation_question";
import { IEvaluationQuestionRepository } from "../../../../shared/domain/repositories/evaluation_question_repository_interface";
import { QUESTION_TYPE } from "../../../../shared/domain/enums/question_type";

export class CreateQuestionUsecase {
  constructor(private repository: IEvaluationQuestionRepository) {}

  async execute(text: string, type: QUESTION_TYPE): Promise<EvaluationQuestion> {
    const question = new EvaluationQuestion({
      text,
      type,
      isActive: true,
    });

    return this.repository.createQuestion(question);
  }
}
