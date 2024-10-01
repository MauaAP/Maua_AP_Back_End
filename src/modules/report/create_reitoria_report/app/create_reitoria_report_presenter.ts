import express, { Request, Response } from "express"
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreateReitoriaReportController } from "./create_reitoria_report_controller";
import { CreateReitoriaReportUsecase } from "./create_reitoria_report_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
CreateReitoriaReportUsecase
const createReitoriaReportUsecase = new CreateReitoriaReportUsecase(eventRepository);
const createReitoriaReportController = new CreateReitoriaReportController(createReitoriaReportUsecase);

router.get("/reitoria-report", authenticateToken, async (req: Request, res: Response) => {
    await createReitoriaReportController.handle(req, res);
})

export default router;