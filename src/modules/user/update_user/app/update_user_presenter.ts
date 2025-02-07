import express, { Request, Response } from "express";
import { UpdateUserController } from "./update_user_controller";
import { UpdateUserUsecase } from "./update_user_usecase";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const userRepository = new UserRepositoryPrisma(); 
const userUsecase = new UpdateUserUsecase(userRepository);
const userController = new UpdateUserController(userUsecase);

router.put("/update-user", authenticateToken, async (req: Request, res: Response) => {
  await userController.handle(req, res);
});

export default router;