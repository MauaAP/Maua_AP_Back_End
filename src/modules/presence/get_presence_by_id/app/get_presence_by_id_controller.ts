import { Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetPresenceByIdUsecase } from "./get_presence_by_id_usecase";
import { GetPresencesByIdViewmodel } from "./get_presence_by_id_viewmodel";
import {
  ParameterError,
  UnprocessableEntity,
} from "../../../../shared/helpers/http/http_codes";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";

export class GetPresenceByIdController {
  constructor(private repo: GetPresenceByIdUsecase) {}

  async handle(req: Request, res: Response) {
    const userFromToken = req.user as UserFromToken;
    const presenceId = req.params.id;

    if (!userFromToken) {
      throw new Forbidden("You don't have permission to access this project");
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
    } catch (error) {
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof InvalidParameter) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof Forbidden) {
        return new Forbidden(error.getMessage()).send(res);
      }
      if (error instanceof NoItemsFound) {
        return new Forbidden(error.message).send(res);
      }
      if (error instanceof UnprocessableEntity) {
        return new UnprocessableEntity(error.getMessage()).send(res);
      }
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
