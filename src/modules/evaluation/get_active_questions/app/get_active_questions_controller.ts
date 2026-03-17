import { Request, Response } from "express";
import { GetActiveQuestionsUsecase } from "./get_active_questions_usecase";
import { GetActiveQuestionsViewmodel } from "./get_active_questions_viewmodel";
import { InternalServerError } from "../../../../shared/helpers/http/http_codes";

export class GetActiveQuestionsController {
  constructor(private usecase: GetActiveQuestionsUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const questions = await this.usecase.execute();
      const viewmodel = new GetActiveQuestionsViewmodel(questions);
      return res.status(200).json(viewmodel);
    } catch {
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
