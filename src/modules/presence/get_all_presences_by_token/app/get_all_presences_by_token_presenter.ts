import express, { Request, Response } from "express";

import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { GetAllPresencesByUserUsecase } from "./get_all_presences_by_token_usecase";
import { GetAllPresencesByUserController } from "./get_all_presences_by_token_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const getAllPresencesByUserUsecase = new GetAllPresencesByUserUsecase(presenceRepository);
const getAllPresencesByUserController = new GetAllPresencesByUserController(getAllPresencesByUserUsecase);

router.get(
  "/presences-by-token/",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getAllPresencesByUserController.handle(req, res);
  }
);

export default router;