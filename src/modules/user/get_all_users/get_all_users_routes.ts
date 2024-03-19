import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../shared/infra/repositories/user_repository_prisma";
import { GetAllUsersUsecase } from "./app/get_all_users_usecase";
import { GetAllUsersController } from "./app/get_all_users_controller";
import { authenticateAdminToken } from "../../../shared/middlewares/jwt_admin_middleware";

const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getAllUsersUsecase = new GetAllUsersUsecase(userRepository);
const getAllUsersController = new GetAllUsersController(getAllUsersUsecase);

router.get("/users", authenticateAdminToken, async (req: Request, res: Response) => {
  await getAllUsersController.handle(req, res);
});

export default router;