import express, { Request, Response } from "express";

import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";

import { GetPresenceByIdUsecase } from "./get_presence_by_id_usecase";
import { GetPresenceByIdController } from "./get_presence_by_id_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const getPresenceByIdUsecase = new GetPresenceByIdUsecase(presenceRepository);
const getPresenceByIdController = new GetPresenceByIdController(getPresenceByIdUsecase);

router.get(
  "/presence/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getPresenceByIdController.handle(req, res);
  }
);

export default router;