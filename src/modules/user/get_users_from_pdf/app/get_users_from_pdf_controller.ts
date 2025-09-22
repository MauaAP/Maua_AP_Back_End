import { Request, Response } from "express";
import { GetUsersFromPdfUsecase, UsersFromPdfResult } from "./get_users_from_pdf_usecase";
import { GetUsersFromPdfViewmodel } from "./get_users_from_pdf_viewmodel";
import { InternalServerError, BadRequest } from "../../../../shared/helpers/http/http_codes";

export class GetUsersFromPdfController {
  constructor(private getUsersFromPdfUsecase: GetUsersFromPdfUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return new BadRequest("Arquivo PDF não enviado").send(res);
      }

      const fileBuffer = req.file.buffer;
      const results: UsersFromPdfResult[] = await this.getUsersFromPdfUsecase.execute(fileBuffer);

      // Para cada nome identificado, retorna a lista de possíveis usuários (viewmodel)
      const response = results.map(r => ({
        name: r.name,
        users: r.users.map(u => new GetUsersFromPdfViewmodel(u)),
      }));

      return res.status(200).json(response);
    } catch (error: any) {
      return new InternalServerError(error.message).send(res);
    }
  }
}
