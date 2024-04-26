import express, { Request, Response } from "express";
import { CreatePresenceController } from "./create_presence_controller";
import { CreatePresenceUsecase } from "./create_presence_usecase";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();
const userRepository = new UserRepositoryPrisma(); 
const presenceRepository = new PresenceRepositoryPrisma(); 
const eventRepository = new EventRepositoryPrisma(); 
const createPresenceUsecase = new CreatePresenceUsecase(presenceRepository, userRepository, eventRepository); // Fix the constructor arguments
const createPresenceController = new CreatePresenceController(createPresenceUsecase);

router.post("/create-presence", authenticateToken, async (req: Request, res: Response) => {
    await createPresenceController.handle(req, res);
});

export default router;
