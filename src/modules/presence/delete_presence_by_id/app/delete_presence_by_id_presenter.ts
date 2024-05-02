import express, { Request, Response } from "express";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { DeletePresenceByIdUsecase } from "./delete_presence_by_id_usecase";
import { deletePresenceByIdController } from "./delete_presence_by_id_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const deletePresenceByIdUsecase = new DeletePresenceByIdUsecase(presenceRepository);
const presenceController = new deletePresenceByIdController(deletePresenceByIdUsecase);

router.delete(
  "/presence/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    await presenceController.handle(req, res);
  }
);

export default router;