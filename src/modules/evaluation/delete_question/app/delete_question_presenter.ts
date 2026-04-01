import express, { Request, Response } from "express";
import { EvaluationQuestionRepositoryPrisma } from "../../../../shared/infra/repositories/evaluation_question_repository_prisma";
import { DeleteQuestionUsecase } from "./delete_question_usecase";
import { DeleteQuestionController } from "./delete_question_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const repository = new EvaluationQuestionRepositoryPrisma();
const usecase = new DeleteQuestionUsecase(repository);
const controller = new DeleteQuestionController(usecase);

router.delete(
  "/evaluations/questions/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
