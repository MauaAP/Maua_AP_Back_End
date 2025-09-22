import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { GenerateAllCertificatesS3Controller } from "./generate_all_certificates_s3_controller";
import { GenerateAllCertificatesS3Usecase } from "./generate_all_certificates_s3_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createCertificateUsecase = new CreateCertificateUsecase(presenceRepository, eventRepository, userRepository);
const generateAllCertificatesS3Usecase = new GenerateAllCertificatesS3Usecase(presenceRepository, createCertificateUsecase);
const generateAllCertificatesS3Controller = new GenerateAllCertificatesS3Controller(generateAllCertificatesS3Usecase);

router.get("/certificates-s3/generate-all", authenticateToken, async (req: Request, res: Response) => {
  await generateAllCertificatesS3Controller.handle(req, res);
});

export default router;
