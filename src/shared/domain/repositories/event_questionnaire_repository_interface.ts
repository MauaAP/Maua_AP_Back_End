import { EvaluationQuestion } from "../entities/evaluation_question";

export interface IEventQuestionnaireRepository {
  /** Perguntas ativas do questionário do evento; se não houver vínculos, retorna todas as perguntas ativas (comportamento legado). */
  findQuestionsForEventForm(eventId: string): Promise<EvaluationQuestion[]>;
  /** IDs de perguntas ativas permitidas neste evento (mesma regra de fallback). */
  getAllowedActiveQuestionIdsForEvent(eventId: string): Promise<string[]>;
  /** Substitui o questionário do evento; apenas perguntas existentes e ativas. */
  replaceQuestionnaire(eventId: string, questionIds: string[]): Promise<void>;
}
