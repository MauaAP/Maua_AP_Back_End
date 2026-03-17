import { Request, Response } from "express";
import { CountPresences2025Usecase } from "./count_presences_2025_usecase";
import { CountPresences2025Viewmodel } from "./count_presences_2025_viewmodel";
import { InternalServerError } from "../../../../shared/helpers/http/http_codes";

export class CountPresences2025Controller {
  constructor(private usecase: CountPresences2025Usecase) {}

  async handle(req: Request, res: Response) {
    try {
      const result = await this.usecase.execute();
      const viewmodel = new CountPresences2025Viewmodel(result);
      return res.status(200).json(viewmodel);
    } catch {
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
