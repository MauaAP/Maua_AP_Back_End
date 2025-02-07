import express, { Request, Response } from "express"
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreateProfessorReportByUserController } from "./create_professor_report_by_user_controller";
import { CreateProfessorReportByUserUsecase } from "./create_professor_report_by_user_usecase";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";
import { PresenceRepositoryPrisma } from "../../../../shared/infra/repositories/presence_repository_prisma";

const router = express.Router();
const presenceRepository = new PresenceRepositoryPrisma();
const eventRepository = new EventRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const createProfessorReportByUserUsecase = new CreateProfessorReportByUserUsecase(presenceRepository, eventRepository, userRepository);
const createProfessorReportController = new CreateProfessorReportByUserController(createProfessorReportByUserUsecase);

router.get("/professor-report/:userId", authenticateToken, async (req: Request, res: Response) => {
    await createProfessorReportController.handle(req, res);
})

export default router;