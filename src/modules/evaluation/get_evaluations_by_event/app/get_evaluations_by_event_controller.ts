import { Request, Response } from "express";
import { GetEvaluationsByEventUsecase } from "./get_evaluations_by_event_usecase";
import { GetEvaluationsByEventViewmodel } from "./get_evaluations_by_event_viewmodel";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "../../../../shared/helpers/http/http_codes";

export class GetEvaluationsByEventController {
  constructor(private usecase: GetEvaluationsByEventUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        return new Forbidden(
          "Apenas administradores e secretários podem visualizar avaliações"
        ).send(res);
      }

      const { eventId } = req.params;

      if (!eventId) {
        return new BadRequest(
          "O parâmetro 'eventId' é obrigatório"
        ).send(res);
      }

      const result = await this.usecase.execute(eventId);
      const viewmodel = new GetEvaluationsByEventViewmodel(result);
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      if (error.message === "Evento não encontrado") {
        return new NotFound(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
