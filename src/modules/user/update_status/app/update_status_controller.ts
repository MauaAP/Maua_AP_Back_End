import { Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserProps } from "../../../../shared/domain/entities/user";
import { MissingParameters } from "../../../../shared/helpers/errors/controller_errors";
import { UpdateStatusViewmodel } from "./update_status_viewmodel";
import { UpdateStatusUsecase } from "./update_status_usecase";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class UpdateStatusController {
  constructor(private updateStatusUseCase: UpdateStatusUsecase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const userFromToken = req.user as UserFromToken;

    const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
    if (!allowedRoles.includes(userFromToken.role)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    if (!req.body) {
      throw new NoItemsFound("Body");
    }
    if (!req.body.id) {
      throw new MissingParameters("Id");
    }
    if (!req.body.status) {
      throw new MissingParameters("Status");
    }

    const { id, status } = req.body;

    try {
      const user = await this.updateStatusUseCase.execute(id, status);

      return res
        .status(200)
        .json(new UpdateStatusViewmodel("User status updated."));
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
