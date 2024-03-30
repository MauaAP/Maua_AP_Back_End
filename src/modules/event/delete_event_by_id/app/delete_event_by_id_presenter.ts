import express, { Request, Response } from "express";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { DeleteEventByIdUsecase } from "./delete_event_by_id_usecase";
import { DeleteEventByIdController } from "./delete_event_by_id_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const deleteEventByIdUsecase = new DeleteEventByIdUsecase(eventRepository);
const eventController = new DeleteEventByIdController(deleteEventByIdUsecase);

router.delete(
  "/delete-event/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    await eventController.handle(req, res);
    //   res.status(204).send();
  }
);

export default router;
