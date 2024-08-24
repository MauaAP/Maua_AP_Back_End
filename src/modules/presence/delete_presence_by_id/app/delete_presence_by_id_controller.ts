import { Request, Response } from "express";
import {
  ForbiddenAction,
  NoItemsFound,
} from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";

import { DeletePresenceByIdUsecase } from "./delete_presence_by_id_usecase";
import { DeletePresenceByIdViewmodel } from "./delete_presence_by_id_viewmodel";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
  UnprocessableEntity,
} from "../../../../shared/helpers/http/http_codes";

export class deletePresenceByIdController {
  constructor(
    private readonly deletePresenceByIdUsecase: DeletePresenceByIdUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.params) {
        throw new MissingParameters("Não foi informado parametros.");
      }
      if (!req.params.id) {
        throw new MissingParameters("Id da presença não informado.");
      }

      await this.deletePresenceByIdUsecase.execute(req.params.id);
      const viewmodel = new DeletePresenceByIdViewmodel(
        "Presença deletada com sucesso."
      );
      res.status(201).json(viewmodel);
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
