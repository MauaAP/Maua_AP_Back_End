import express, { Request, Response } from "express";

import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { GetAllEventsUsecase } from "./get_all_events_usecase";
import { GetAllEventsController } from "./get_all_events_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const getAllEventsUsecase = new GetAllEventsUsecase(eventRepository);
const getAllEventsController = new GetAllEventsController(getAllEventsUsecase);

router.get(
  "/events",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getAllEventsController.handle(req, res);
  }
);

export default router;
