import { Request, Response } from "express";
import { SetEventQuestionnaireUsecase } from "./set_event_questionnaire_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "../../../../shared/helpers/http/http_codes";

export class SetEventQuestionnaireController {
  constructor(private usecase: SetEventQuestionnaireUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (userFromToken.role !== "ADMIN") {
        return new Forbidden(
          "Apenas administradores podem configurar o questionário do evento"
        ).send(res);
      }

      const { eventId } = req.params;
      if (!eventId) {
        return new BadRequest("O parâmetro 'eventId' é obrigatório").send(res);
      }

      const { questionIds } = req.body;
      if (!Array.isArray(questionIds)) {
        return new BadRequest(
          "O campo 'questionIds' deve ser um array de UUIDs"
        ).send(res);
      }
      const ids = questionIds.filter(
        (x: unknown) => typeof x === "string" && x.trim().length > 0
      ) as string[];

      await this.usecase.execute(eventId, ids);
      return res.status(200).json({
        message: "Questionário do evento atualizado com sucesso",
        questionIds: ids,
      });
    } catch (error: any) {
      if (error.message === "Evento não encontrado") {
        return new NotFound(error.message).send(res);
      }
      if (
        typeof error.message === "string" &&
        error.message.startsWith("Pergunta(s) inválida(s)")
      ) {
        return new BadRequest(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
