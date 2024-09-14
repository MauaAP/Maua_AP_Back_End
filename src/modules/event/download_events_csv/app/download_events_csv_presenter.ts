import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { DownloadEventsCsvUsecase } from "./download_events_csv_usecase";
import { GetAllEventsController } from "./download_events_csv_controller";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";

const router = express.Router();

const eventsRepository = new EventRepositoryPrisma();
const getAllEventsUseCase = new DownloadEventsCsvUsecase(eventsRepository);
const getAllEventsController = new GetAllEventsController(getAllEventsUseCase);

router.get(
  "/download-events",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getAllEventsController.handle(req, res);
  }
);

export default router;
