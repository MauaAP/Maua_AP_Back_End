import express, { Request, Response } from "express";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";
import { ExternalPresenceRepositoryPrisma } from "../../../../shared/infra/repositories/external_presence_prisma";
import { DownloadPresencesByEventExcelUsecase } from "./download_presences_by_event_excel_usecase";
import { DownloadPresencesByEventExcelController } from "./download_presences_by_event_excel_controller";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";

const router = express.Router();

const presenceRepository = new PresenceRepositoryPrisma();
const externalPresenceRepository = new ExternalPresenceRepositoryPrisma();
const usecase = new DownloadPresencesByEventExcelUsecase(presenceRepository, externalPresenceRepository);
const controller = new DownloadPresencesByEventExcelController(usecase);

router.get(
  "/presences/event/:eventId/excel",
  authenticateToken,
  async (req: Request, res: Response) => {
    await controller.handle(req, res);
  }
);

export default router;
