import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../shared/infra/repositories/user_repository_prisma";
import { UpdateUserUsecase } from "./app/update_user_usecase";
import { UpdateUserController } from "./app/update_user_controller";
import { authenticateToken } from "../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const userRepository = new UserRepositoryPrisma();
const updateUserUsecase = new UpdateUserUsecase(userRepository);
const upadeteUserController = new UpdateUserController(updateUserUsecase);

router.put(
  "/update-user",
  authenticateToken,
  async (req: Request, res: Response) => {
    await upadeteUserController.handle(req, res);
  }
);

export default router;
