import express, { Request, Response } from "express";

import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { GetAllPresencesUsecase } from "./get_all_presences_usecase";
import { GetAllPresencesController } from "./get_all_presences_controller";

import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const getAllPresencesByEventUsecase = new GetAllPresencesUsecase(presenceRepository);
const getAllPresencesByEventController = new GetAllPresencesController(getAllPresencesByEventUsecase);

router.get(
  "/presences",
  // authenticateToken,
  async (req: Request, res: Response) => {
    await getAllPresencesByEventController.handle(req, res);
  }
);

export default router;