import { Request, Response } from "express";
import { CreateEvaluationUsecase } from "./create_evaluation_usecase";
import { CreateEvaluationViewmodel } from "./create_evaluation_viewmodel";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
} from "../../../../shared/helpers/http/http_codes";

export class CreateEvaluationController {
  constructor(private usecase: CreateEvaluationUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return new BadRequest("O parâmetro 'eventId' é obrigatório").send(res);
      }

      const userFromToken = req.user as UserFromToken | undefined;
      const { externalEmail, answers } = req.body;

      if (!userFromToken && !externalEmail) {
        return new BadRequest(
          "É necessário estar autenticado ou informar o externalEmail"
        ).send(res);
      }

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return new BadRequest(
          "É necessário enviar ao menos uma resposta no campo 'answers'"
        ).send(res);
      }

      const evaluation = await this.usecase.execute({
        eventId,
        userId: userFromToken?.id,
        externalEmail: userFromToken ? undefined : externalEmail,
        answers,
      });

      const viewmodel = new CreateEvaluationViewmodel(evaluation);
      return res.status(201).json(viewmodel);
    } catch (error: any) {
      if (error.message === "Evento não encontrado") {
        return new NotFound(error.message).send(res);
      }
      if (
        error.message === "O evento ainda não foi finalizado" ||
        error.message ===
          "Usuário não possui presença confirmada neste evento" ||
        error.message ===
          "Convidado externo não possui presença confirmada neste evento"
      ) {
        return new Forbidden(error.message).send(res);
      }
      if (
        error.message === "Usuário já avaliou este evento" ||
        error.message === "Convidado externo já avaliou este evento"
      ) {
        return new Conflict(error.message).send(res);
      }
      if (error.message === "É necessário enviar ao menos uma resposta") {
        return new BadRequest(error.message).send(res);
      }
      if (
        error.message ===
        "Uma ou mais perguntas não fazem parte do questionário deste evento"
      ) {
        return new BadRequest(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
