import { Request, Response } from "express";
import { UpdateEvaluationUsecase } from "./update_evaluation_usecase";
import { UpdateEvaluationViewmodel } from "./update_evaluation_viewmodel";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "../../../../shared/helpers/http/http_codes";

export class UpdateEvaluationController {
  constructor(private usecase: UpdateEvaluationUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const { evaluationId } = req.params;

      if (!evaluationId) {
        return new BadRequest(
          "O parâmetro 'evaluationId' é obrigatório"
        ).send(res);
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
        evaluationId,
        userId: userFromToken?.id,
        externalEmail: userFromToken ? undefined : externalEmail,
        answers,
      });

      const viewmodel = new UpdateEvaluationViewmodel(evaluation);
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      if (error.message === "Avaliação não encontrada") {
        return new NotFound(error.message).send(res);
      }
      if (
        error.message ===
        "Você não tem permissão para editar esta avaliação"
      ) {
        return new Forbidden(error.message).send(res);
      }
      if (error.message === "É necessário enviar ao menos uma resposta") {
        return new BadRequest(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
