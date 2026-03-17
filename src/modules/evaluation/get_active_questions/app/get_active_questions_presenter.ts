import express, { Request, Response } from "express";
import { GetActiveQuestionsUsecase } from "./get_active_questions_usecase";
import { GetActiveQuestionsController } from "./get_active_questions_controller";
import { EvaluationQuestionRepositoryPrisma } from "../../../../shared/infra/repositories/evaluation_question_repository_prisma";

const router = express.Router();

const repository = new EvaluationQuestionRepositoryPrisma();
const usecase = new GetActiveQuestionsUsecase(repository);
const controller = new GetActiveQuestionsController(usecase);

router.get("/evaluations/questions", async (req: Request, res: Response) => {
  await controller.handle(req, res);
});

export default router;
