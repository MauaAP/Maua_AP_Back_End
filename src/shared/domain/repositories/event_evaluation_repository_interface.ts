import { EventEvaluation } from "../entities/event_evaluation";

export interface IEventEvaluationRepository {
  createEvaluation(evaluation: EventEvaluation): Promise<EventEvaluation>;
  updateEvaluation(evaluation: EventEvaluation): Promise<EventEvaluation>;
  getEvaluationsByEventId(eventId: string): Promise<EventEvaluation[]>;
  getEvaluationByUserAndEvent(
    eventId: string,
    userId: string
  ): Promise<EventEvaluation | null>;
  getEvaluationByExternalEmailAndEvent(
    eventId: string,
    externalEmail: string
  ): Promise<EventEvaluation | null>;
  getEvaluationById(id: string): Promise<EventEvaluation | null>;
}
