import express, { Request, Response } from "express";
import { SetEventQuestionnaireUsecase } from "./set_event_questionnaire_usecase";
import { SetEventQuestionnaireController } from "./set_event_questionnaire_controller";
import { EventQuestionnaireRepositoryPrisma } from "../../../../shared/infra/repositories/event_questionnaire_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const repo = new EventQuestionnaireRepositoryPrisma();
const usecase = new SetEventQuestionnaireUsecase(repo);
const controller = new SetEventQuestionnaireController(usecase);

router.put(
  "/evaluations/event/:eventId/questionnaire",
  authenticateToken,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
