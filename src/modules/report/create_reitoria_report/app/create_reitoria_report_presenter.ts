import express, { Request, Response } from "express"
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreateReitoriaReportController } from "./create_reitoria_report_controller";
import { CreateReitoriaReportUsecase } from "./create_reitoria_report_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const presenceRepository = new PresenceRepositoryPrisma();
CreateReitoriaReportUsecase
const createReitoriaReportUsecase = new CreateReitoriaReportUsecase(eventRepository, presenceRepository);
const createReitoriaReportController = new CreateReitoriaReportController(createReitoriaReportUsecase);

router.get("/reitoria-report", authenticateToken, async (req: Request, res: Response) => {
    await createReitoriaReportController.handle(req, res);
})

export default router;