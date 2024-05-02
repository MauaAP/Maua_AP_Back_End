import { Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetPresenceByIdUsecase } from "./get_presence_by_id_usecase";
import { GetPresencesByIdViewmodel } from "./get_presence_by_id_viewmodel";

export class GetPresenceByIdController {
  constructor(private repo: GetPresenceByIdUsecase) {}

  async handle(req: Request, res: Response) {
    const userFromToken = req.user as UserFromToken;
    const presenceId = req.params.id;

    if (!userFromToken) {
      return res.status(403).json({ error: "Acesso negado." });
    }
    if (!presenceId) {
      return res.status(400).json({ error: "Id da presença não informado." });
    }
    try {
      const presence = await this.repo.execute(presenceId);
      if (!presence) {
        return res.status(204).json({ error: "Presença não encontrada." });
      }

      const viewmodel = new GetPresencesByIdViewmodel(presence);
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      console.error("Erro ao buscar evento por ID:", error);
      throw new Error("Erro ao buscar evento por ID no banco de dados.");
    }
  }
}
