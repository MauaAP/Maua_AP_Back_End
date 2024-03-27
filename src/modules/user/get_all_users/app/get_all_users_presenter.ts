import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { GetAllUsersUsecase } from "./get_all_users_usecase";
import { GetAllUsersController } from "./get_all_users_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware"; 

const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getAllUsersUsecase = new GetAllUsersUsecase(userRepository);
const getAllUsersController = new GetAllUsersController(getAllUsersUsecase);

router.get(
  "/users",
  authenticateToken,
  async (req: Request, res: Response) => {
    await getAllUsersController.handle(req, res);
  }
);

export default router;
