import { Request, Response } from "express";
import { GetEventEvaluationQuestionsUsecase } from "./get_event_evaluation_questions_usecase";
import { GetEventEvaluationQuestionsViewmodel } from "./get_event_evaluation_questions_viewmodel";
import {
  BadRequest,
  InternalServerError,
  NotFound,
} from "../../../../shared/helpers/http/http_codes";

export class GetEventEvaluationQuestionsController {
  constructor(private usecase: GetEventEvaluationQuestionsUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        return new BadRequest("O parâmetro 'eventId' é obrigatório").send(res);
      }
      const questions = await this.usecase.execute(eventId);
      const vm = new GetEventEvaluationQuestionsViewmodel(questions);
      return res.status(200).json(vm);
    } catch (error: any) {
      if (error.message === "Evento não encontrado") {
        return new NotFound(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
