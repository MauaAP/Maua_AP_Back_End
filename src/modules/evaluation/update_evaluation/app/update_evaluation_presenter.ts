import express, { Request, Response, NextFunction } from "express";
import { UpdateEvaluationUsecase } from "./update_evaluation_usecase";
import { UpdateEvaluationController } from "./update_evaluation_controller";
import { EventEvaluationRepositoryPrisma } from "../../../../shared/infra/repositories/event_evaluation_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const repository = new EventEvaluationRepositoryPrisma();
const usecase = new UpdateEvaluationUsecase(repository);
const controller = new UpdateEvaluationController(usecase);

function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}

router.put(
  "/evaluations/:evaluationId",
  optionalAuth,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
