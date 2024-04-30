import express, { Request, Response } from "express";
import { UpdateStatusController } from "./update_status_controller";
import { UpdateStatusUsecase } from "./update_status_usecase";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const userRepository = new UserRepositoryPrisma();
const updateStatusUsecase = new UpdateStatusUsecase(userRepository);
const updateStatusController = new UpdateStatusController(updateStatusUsecase);

router.put("/update-status", authenticateToken,  async (req: Request, res: Response) => {
  await updateStatusController.handle(req, res);
});

export default router;