import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllEventsViewmodel } from "./get_all_events_viewmodel";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import {
  ForbiddenAction,
  NoItemsFound,
} from "../../../../shared/helpers/errors/usecase_errors";
import { GetAllEventsUsecase } from "./get_all_events_usecase";

export class GetAllEventsController {
  constructor(private repo: GetAllEventsUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if (userFromToken.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado." });
      }

      const events = await this.repo.execute();
      const viewmodel = events.map((event) => new GetAllEventsViewmodel(event));
      res.status(200).json(viewmodel);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return res.status(404).json({ error: error.message });
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof ForbiddenAction) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
