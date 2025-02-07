import { Request, Response } from "express";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { UpdateStatusViewmodel } from "./update_status_viewmodel";
import { UpdateStatusUsecase } from "./update_status_usecase";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class UpdateStatusController {
  constructor(private updateStatusUseCase: UpdateStatusUsecase) {}

  async handle(req: Request, res: Response) {
    const userFromToken = req.user as UserFromToken;

    const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
    if (!allowedRoles.includes(userFromToken.role)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    if (!req.body) {
      throw new MissingParameters("Body");
    }
    if (!req.body.id) {
      throw new MissingParameters("Id");
    }
    if (!req.body.status) {
      throw new MissingParameters("Status");
    }

    const { id, status } = req.body;

    try {
      await this.updateStatusUseCase.execute(id, status);

      return res
        .status(200)
        .json(new UpdateStatusViewmodel("User status updated."));
    } catch (error: any) {
      if (error instanceof InvalidRequest) {
        new BadRequest(error.message).send(res);
      }
      if (error instanceof InvalidParameter) {
        new ParameterError(error.message).send(res);
      }
      if (error instanceof EntityError) {
        new ParameterError(error.message).send(res);
      }
      if (error instanceof Forbidden) {
        new Forbidden(error.getMessage()).send(res);
      }
      if (error instanceof NoItemsFound) {
        new Forbidden(error.message).send(res);
      }
      new InternalServerError("Internal Server Error").send(res);
    }
  }
}
