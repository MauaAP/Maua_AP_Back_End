import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { CreateExternalCertificateUsecase } from "./create_external_certificate_usecase";
import { CreateExternalCertificateController } from "./create_external_certificate_controller";
import { ExternalPresenceRepositoryPrisma } from "../../../../shared/infra/repositories/external_presence_prisma";

const router = express.Router();
const presenceRepository = new ExternalPresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const createCertificateUseCase = new CreateExternalCertificateUsecase(
  presenceRepository,
  eventRepository
);
const createExternalCertificateController =
  new CreateExternalCertificateController(createCertificateUseCase);

router.get(
  "/create-external-certificate/:presenceId",
  authenticateToken,
  async (req: Request, res: Response) => {
    await createExternalCertificateController.handle(req, res);
  }
);

export default router;
