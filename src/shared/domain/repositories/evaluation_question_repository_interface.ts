import { EvaluationQuestion } from "../entities/evaluation_question";

export interface IEvaluationQuestionRepository {
  getActiveQuestions(): Promise<EvaluationQuestion[]>;
  createQuestion(question: EvaluationQuestion): Promise<EvaluationQuestion>;
}
