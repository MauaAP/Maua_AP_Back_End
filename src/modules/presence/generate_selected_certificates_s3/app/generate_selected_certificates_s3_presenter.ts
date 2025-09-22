import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { GenerateSelectedCertificatesS3Controller } from "./generate_selected_certificates_s3_controller";
import { GenerateSelectedCertificatesS3Usecase } from "./generate_selected_certificates_s3_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createCertificateUsecase = new CreateCertificateUsecase(presenceRepository, eventRepository, userRepository);
const generateSelectedCertificatesS3Usecase = new GenerateSelectedCertificatesS3Usecase(presenceRepository, createCertificateUsecase);
const generateSelectedCertificatesS3Controller = new GenerateSelectedCertificatesS3Controller(generateSelectedCertificatesS3Usecase);

router.post("/certificates-s3/generate-selected", authenticateToken, async (req: Request, res: Response) => {
  await generateSelectedCertificatesS3Controller.handle(req, res);
});

export default router;
