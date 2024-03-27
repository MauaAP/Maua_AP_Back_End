import express, { Request, Response } from "express";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { CreateEventController } from "./create_event_controller";
import { CreateEventUsecase } from "./create_event_usecase";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const createEventUsecase = new CreateEventUsecase(eventRepository);
const eventController = new CreateEventController(createEventUsecase);

router.post(
  "/create-event",
  authenticateToken,
  async (req: Request, res: Response) => {
    await eventController.createEvent(req, res);
  }
);

export default router;
