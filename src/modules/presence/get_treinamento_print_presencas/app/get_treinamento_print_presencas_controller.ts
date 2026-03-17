import { Request, Response } from "express";
import { GetTreinamentoPrintPresencasUsecase } from "./get_treinamento_print_presencas_usecase";
import { InternalServerError } from "../../../../shared/helpers/http/http_codes";

export class GetTreinamentoPrintPresencasController {
  constructor(private usecase: GetTreinamentoPrintPresencasUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const data = await this.usecase.execute();
      return res.status(200).json(data);
    } catch {
      return new InternalServerError("Erro interno.").send(res);
    }
  }
}
