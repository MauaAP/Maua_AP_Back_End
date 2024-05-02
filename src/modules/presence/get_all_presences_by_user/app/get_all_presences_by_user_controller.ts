import { Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllPresencesByUserUsecase } from "./get_all_presences_by_user_usecase";
import { GetAllPresencesByUserViewmodel } from "./get_all_presences_by_user_viewmodel";

export class GetAllPresencesByUserController {
  constructor(private repo: GetAllPresencesByUserUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if(!req.headers) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      if (!userFromToken) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      const userId: string = userFromToken.id;
      const presences = await this.repo.execute(userId);
      const viewmodel = presences.map(
        (presence) => new GetAllPresencesByUserViewmodel(presence)
      );
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      if (
        error instanceof BadRequest ||
        error instanceof Forbidden ||
        error instanceof InternalServerError
      ) {
        return res.status(error.status).json(error);
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
