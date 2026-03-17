import express, { Request, Response } from "express";
import { GetEvaluationsByEventUsecase } from "./get_evaluations_by_event_usecase";
import { GetEvaluationsByEventController } from "./get_evaluations_by_event_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const usecase = new GetEvaluationsByEventUsecase();
const controller = new GetEvaluationsByEventController(usecase);

router.get(
  "/evaluations/event/:eventId",
  authenticateToken,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
