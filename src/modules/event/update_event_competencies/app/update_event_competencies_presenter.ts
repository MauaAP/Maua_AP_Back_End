import express, { Request, Response } from "express";
import { authenticateToken } from "../../../../shared/middlewares/jwt_middleware";
import { UpdateEventCompetenciesController } from "./update_event_competencies_controller";
import { UpdateEventCompetenciesUsecase } from "./update_event_competencies_usecase";
import { EventRepositoryPrisma } from "../../../../shared/infra/repositories/event_repository_prisma";

const router = express.Router();
const eventRepository = new EventRepositoryPrisma();
const usecase = new UpdateEventCompetenciesUsecase(eventRepository);
const controller = new UpdateEventCompetenciesController(usecase);

router.put("/event/:eventId/competencies", authenticateToken, async (req: Request, res: Response) => {
  await controller.handle(req, res);
});

export default router;
