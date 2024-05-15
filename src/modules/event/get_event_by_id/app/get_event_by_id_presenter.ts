import express, { Request, Response } from "express";

import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { GetEventByIdUsecase } from "./get_event_by_id_usecase";
import { GetEventByIdController } from "./get_event_by_id_controller";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const getEventByIdUsecase = new GetEventByIdUsecase(eventRepository);
const getEventByIdController = new GetEventByIdController(getEventByIdUsecase);

router.get(
  "/events/:eventId",
  async (req: Request, res: Response) => {
    await getEventByIdController.handle(req, res);
  }
);

export default router;
