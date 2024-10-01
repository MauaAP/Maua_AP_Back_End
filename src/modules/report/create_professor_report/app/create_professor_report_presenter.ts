import express, { Request, Response } from "express"
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreateProfessorReportController } from "./create_professor_report_controller";
import { CreateProfessorReportUsecase } from "./create_professor_report_usecase";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createProfessorReportUseCase = new CreateProfessorReportUsecase(presenceRepository, eventRepository, userRepository);
const createProfessorReportController = new CreateProfessorReportController(createProfessorReportUseCase);

router.get("/professor-report", authenticateToken, async (req: Request, res: Response) => {
    await createProfessorReportController.handle(req, res);
})

export default router;