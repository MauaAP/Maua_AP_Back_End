import express, { Request, Response } from "express"
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreateCertificateController } from "./create_certificate_controller";
import { CreateCertificateUsecase } from "./create_certificate_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createCertificateUseCase = new CreateCertificateUsecase(presenceRepository, eventRepository, userRepository);
const createCertificateController = new CreateCertificateController(createCertificateUseCase);

router.get("/create-certificate/:presenceId", authenticateToken, async (req: Request, res: Response) => {
    await createCertificateController.handle(req, res);
})

export default router;