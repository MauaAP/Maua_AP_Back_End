import express, { Request, Response } from "express";
import { AuthUserController } from "./app/auth_user_controller";
import { AuthUserUsecase } from "./app/auth_user_usecase";
import { UserRepositoryPrisma } from "../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const userRepository = new UserRepositoryPrisma();
const authUserUsecase = new AuthUserUsecase(userRepository);
const authUserController = new AuthUserController(authUserUsecase);

router.post("/auth-user", async (req: Request, res: Response) => {
  await authUserController.handle(req, res);
});

export default router;
