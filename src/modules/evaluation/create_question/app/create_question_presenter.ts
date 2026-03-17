import express, { Request, Response } from "express";
import { CreateQuestionUsecase } from "./create_question_usecase";
import { CreateQuestionController } from "./create_question_controller";
import { EvaluationQuestionRepositoryPrisma } from "../../../../shared/infra/repositories/evaluation_question_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const repository = new EvaluationQuestionRepositoryPrisma();
const usecase = new CreateQuestionUsecase(repository);
const controller = new CreateQuestionController(usecase);

router.post(
  "/evaluations/questions",
  authenticateToken,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
