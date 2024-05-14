import express, { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { GetAllUsersToPresenceListUsecase } from "./get_all_users_to_presence_list_usecase";
import { GetAllUsersToPresenceListController } from "./get_all_users_to_presence_list_controller";

const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getAllUsersUsecase = new GetAllUsersToPresenceListUsecase(userRepository);
const getAllUsersController = new GetAllUsersToPresenceListController(getAllUsersUsecase);

router.get(
  "/users-list",
  async (req: Request, res: Response) => {
    await getAllUsersController.handle(req, res);
  }
);

export default router;
