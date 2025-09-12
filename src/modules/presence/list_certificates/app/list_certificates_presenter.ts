import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { ListCertificatesController } from "./list_certificates_controller";
import { ListCertificatesUsecase } from "./list_certificates_usecase";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const listCertificatesUsecase = new ListCertificatesUsecase(presenceRepository, eventRepository);
const listCertificatesController = new ListCertificatesController(listCertificatesUsecase);

router.get("/certificates", authenticateToken, async (req: Request, res: Response) => {
  await listCertificatesController.handle(req, res);
});

export default router;
