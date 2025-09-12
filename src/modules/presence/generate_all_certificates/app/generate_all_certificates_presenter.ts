import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { GenerateAllCertificatesController } from "./generate_all_certificates_controller";
import { GenerateAllCertificatesUsecase } from "./generate_all_certificates_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createCertificateUsecase = new CreateCertificateUsecase(presenceRepository, eventRepository, userRepository);
const generateAllCertificatesUsecase = new GenerateAllCertificatesUsecase(presenceRepository, createCertificateUsecase);
const generateAllCertificatesController = new GenerateAllCertificatesController(generateAllCertificatesUsecase);

router.post("/certificates/generate-all", authenticateToken, async (req: Request, res: Response) => {
  await generateAllCertificatesController.handle(req, res);
});

export default router;
