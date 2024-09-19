import { Request, Response } from "express";
import { CreateExternalPresenceViewModel } from "./create_external_presence_viewmodel";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { CreateExternalPresenceUsecase } from "./create_external_presence_usecase";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class CreateExternalPresenceController {
  constructor(
    private createExternalPresenceUseCase: CreateExternalPresenceUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { email, name, eventId } = req.body;

      if (!email) {
        throw new MissingParameters("Missing email parameter.");
      }
      if (!name) {
        throw new MissingParameters("Missing name parameter.");
      }
      if (!eventId) {
        throw new MissingParameters("Missing event ID parameter.");
      }

      await this.createExternalPresenceUseCase.execute({
        email,
        name,
        eventId,
      });

      const externalPresenceViewModel = new CreateExternalPresenceViewModel(
        "Presença externa registrada!"
      );

      return res.status(200).json(externalPresenceViewModel);
    } catch (error: any) {
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
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
