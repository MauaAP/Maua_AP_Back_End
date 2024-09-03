import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { DownloadUsersCsvUsecase } from "./download_users_csv_usecase";
import { GetAllUsersController } from "./download_users_csv_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getAllUsersUseCase = new DownloadUsersCsvUsecase(userRepository);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);

router.get(
  "/download-users",
  async (req: Request, res: Response) => {
    await getAllUsersController.handle(req, res);
  }
);

export default router;
