import { Request, Response } from "express";
import { CreateQuestionUsecase } from "./create_question_usecase";
import { CreateQuestionViewmodel } from "./create_question_viewmodel";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { QUESTION_TYPE } from "../../../../shared/domain/enums/question_type";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
} from "../../../../shared/helpers/http/http_codes";

export class CreateQuestionController {
  constructor(private usecase: CreateQuestionUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if (userFromToken.role !== "ADMIN") {
        return new Forbidden(
          "Apenas administradores podem criar perguntas"
        ).send(res);
      }

      const { text, type } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return new BadRequest("O campo 'text' é obrigatório").send(res);
      }

      if (!type || !Object.values(QUESTION_TYPE).includes(type)) {
        return new BadRequest(
          "O campo 'type' deve ser RATING ou TEXT"
        ).send(res);
      }

      const question = await this.usecase.execute(text, type);
      const viewmodel = new CreateQuestionViewmodel(question);
      return res.status(201).json(viewmodel);
    } catch {
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
