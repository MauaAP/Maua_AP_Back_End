import express, { Request, Response } from "express";
import { CreateUserController } from "../create_user/app/create_user_controller";
import { CreateUserUsecase } from "../create_user/app/create_user_usecase";
import { UserRepositoryPrisma } from "../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const userRepository = new UserRepositoryPrisma(); 
const createUserUsecase = new CreateUserUsecase(userRepository);
const userController = new CreateUserController(createUserUsecase);

router.post("/create-user", async (req: Request, res: Response) => {
  await userController.createUser(req, res);
});

export default router;
