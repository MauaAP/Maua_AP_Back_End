import { Request, Response } from "express";
import { GetAllPresencesByEventUsecase } from "./get_all_presences_by_event_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { GetAllPresencesByEventViewmodel } from "./get_all_presences_by_event_viewmodel";

export class GetAllPresencesByEventController {
  constructor(private getAllPresencesByEventUsecase: GetAllPresencesByEventUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        return res.status(403).json({ error: "Acesso negado." });
      }
      if (!req.params.eventId) {
        return res.status(400).json({ error: "Id do evento não informado." });
      }
      if (!req.params) {
        return res.status(400).json({ error: "Dados não informados." });
      }
      
      const eventId: string = req.params.eventId;
      const presences = await this.getAllPresencesByEventUsecase.execute(eventId);
      const viewmodel = presences.map((presence) => new GetAllPresencesByEventViewmodel(presence));
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      if (
        error instanceof BadRequest ||
        error instanceof Forbidden ||
        error instanceof InternalServerError
      ) {
        return res.status(error.status).json(error);
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
