import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { GetUserByEmailUseCase } from "./get_user_by_email_usecase";
import { GetUserByEmailController } from "./get_user_by_email_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
const getUserByEmailController = new GetUserByEmailController(
  getUserByEmailUseCase
);

router.get("/user", authenticateToken, async (req: Request, res: Response) => {
  await getUserByEmailController.handle(req, res);
});

export default router;
