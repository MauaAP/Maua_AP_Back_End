import express, { Request, Response, NextFunction } from "express";
import { CreateEvaluationUsecase } from "./create_evaluation_usecase";
import { CreateEvaluationController } from "./create_evaluation_controller";
import { EventEvaluationRepositoryPrisma } from "../../../../shared/infra/repositories/event_evaluation_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const repository = new EventEvaluationRepositoryPrisma();
const usecase = new CreateEvaluationUsecase(repository);
const controller = new CreateEvaluationController(usecase);

function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}

router.post(
  "/evaluations/event/:eventId",
  optionalAuth,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
