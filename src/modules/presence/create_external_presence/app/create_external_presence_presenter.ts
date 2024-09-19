import express, { Request, Response } from "express";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { CreateExternalPresenceController } from "./create_external_presence_controller";
import { CreateExternalPresenceUsecase } from "./create_external_presence_usecase";
import { ExternalPresenceRepositoryPrisma } from "../../../../shared/infra/repositories/external_presence_prisma";

const router = express.Router();
const presenceRepository = new ExternalPresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const createExternalPresenceUsecase = new CreateExternalPresenceUsecase(
  presenceRepository,
  eventRepository
);
const createExternalPresenceController = new CreateExternalPresenceController(
  createExternalPresenceUsecase
);

router.post(
  "/create-external-presence",
  //   authenticateToken,
  async (req: Request, res: Response) => {
    await createExternalPresenceController.handle(req, res);
  }
);

export default router;
