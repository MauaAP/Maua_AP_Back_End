import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { ListCertificatesS3Controller } from "./list_certificates_s3_controller";
import { ListCertificatesS3Usecase } from "./list_certificates_s3_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const listCertificatesS3Usecase = new ListCertificatesS3Usecase(presenceRepository, eventRepository);
const listCertificatesS3Controller = new ListCertificatesS3Controller(listCertificatesS3Usecase);

router.get("/certificates-s3", authenticateToken, async (req: Request, res: Response) => {
  await listCertificatesS3Controller.handle(req, res);
});

export default router;
