import { IEvaluationQuestionRepository } from "../../../../shared/domain/repositories/evaluation_question_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class DeleteQuestionUsecase {
  constructor(private readonly repository: IEvaluationQuestionRepository) {}

  async execute(id: string): Promise<void> {
    const questions = await this.repository.getActiveQuestions();
    const exists = questions.some((q) => q.id === id);
    if (!exists) {
      throw new NoItemsFound("question");
    }
    await this.repository.deleteQuestion(id);
  }
}
