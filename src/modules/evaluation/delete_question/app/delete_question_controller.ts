import { Request, Response } from "express";
import { DeleteQuestionUsecase } from "./delete_question_usecase";
import { DeleteQuestionViewmodel } from "./delete_question_viewmodel";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { MissingParameters } from "../../../../shared/helpers/errors/controller_errors";
import {
  Forbidden,
  InternalServerError,
  NotFound,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class DeleteQuestionController {
  constructor(private readonly usecase: DeleteQuestionUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if (userFromToken.role !== "ADMIN") {
        return new Forbidden("Apenas administradores podem deletar perguntas").send(res);
      }

      const { id } = req.params;
      if (!id) {
        throw new MissingParameters("id");
      }

      await this.usecase.execute(id);
      const viewmodel = new DeleteQuestionViewmodel("Pergunta deletada com sucesso.");
      return res.status(200).json(viewmodel);
    } catch (error) {
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
