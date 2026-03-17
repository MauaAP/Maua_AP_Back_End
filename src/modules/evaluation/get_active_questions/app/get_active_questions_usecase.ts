import { EvaluationQuestion } from "../../../../shared/domain/entities/evaluation_question";
import { IEvaluationQuestionRepository } from "../../../../shared/domain/repositories/evaluation_question_repository_interface";

export class GetActiveQuestionsUsecase {
  constructor(private repository: IEvaluationQuestionRepository) {}

  async execute(): Promise<EvaluationQuestion[]> {
    return this.repository.getActiveQuestions();
  }
}
