import express, { Request, Response } from "express";

import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { GetAllPresencesByEventUsecase } from "./get_all_presences_by_event_usecase";
import { GetAllPresencesByEventController } from "./get_all_presences_by_event_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const getAllPresencesByEventUsecase = new GetAllPresencesByEventUsecase(presenceRepository);
const getAllPresencesByEventController = new GetAllPresencesByEventController(getAllPresencesByEventUsecase);

router.get(
  "/presences/:eventId/",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getAllPresencesByEventController.handle(req, res);
  }
);

export default router;