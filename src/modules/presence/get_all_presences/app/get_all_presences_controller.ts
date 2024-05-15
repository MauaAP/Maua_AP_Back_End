import { Request, Response } from "express";
import { GetAllPresencesUsecase } from "./get_all_presences_usecase";
import { GetAllPresencesViewmodel } from "./get_all_presences_viewmodel";

import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";

export class GetAllPresencesController {
  constructor(private getAllPresencesUsecase: GetAllPresencesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      const presences = await this.getAllPresencesUsecase.execute();
      const viewmodel = presences.map(
        (presence) => new GetAllPresencesViewmodel(presence)
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
