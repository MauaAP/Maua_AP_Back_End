import express, { Request, Response } from "express";
import { GetEventEvaluationQuestionsUsecase } from "./get_event_evaluation_questions_usecase";
import { GetEventEvaluationQuestionsController } from "./get_event_evaluation_questions_controller";
import { EventQuestionnaireRepositoryPrisma } from "../../../../shared/infra/repositories/event_questionnaire_repository_prisma";

const router = express.Router();
const repo = new EventQuestionnaireRepositoryPrisma();
const usecase = new GetEventEvaluationQuestionsUsecase(repo);
const controller = new GetEventEvaluationQuestionsController(usecase);

router.get(
  "/evaluations/event/:eventId/questions",
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
