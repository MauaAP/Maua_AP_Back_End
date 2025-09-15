import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { GenerateSelectedCertificatesController } from "./generate_selected_certificates_controller";
import { GenerateSelectedCertificatesUsecase } from "./generate_selected_certificates_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createCertificateUsecase = new CreateCertificateUsecase(presenceRepository, eventRepository, userRepository);
const generateSelectedCertificatesUsecase = new GenerateSelectedCertificatesUsecase(presenceRepository, createCertificateUsecase);
const generateSelectedCertificatesController = new GenerateSelectedCertificatesController(generateSelectedCertificatesUsecase);

router.get("/certificates/generate-selected", authenticateToken, async (req: Request, res: Response) => {
  await generateSelectedCertificatesController.handle(req, res);
});

export default router;
