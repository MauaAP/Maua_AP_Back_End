import express, { Request, Response } from "express";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UpdateEventController } from "./update_event_controller";
import { UpdateEventUsecase } from "./update_event_usecase";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const updateEventUsecase = new UpdateEventUsecase(eventRepository);
const updateEventController = new UpdateEventController(updateEventUsecase);

router.put(
  "/update-event/:eventId",
  authenticateToken,
  async (req: Request, res: Response) => {
    await updateEventController.updateEvent(req, res);
  }
);

export default router;
