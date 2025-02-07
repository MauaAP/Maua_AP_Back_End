import { Request, Response } from "express";
import { DeleteEventByIdUsecase } from "./delete_event_by_id_usecase";
import { DeleteEventByIdViewmodel } from "./delete_event_by_id_viewmodel";
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
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
  UnprocessableEntity,
} from "../../../../shared/helpers/http/http_codes";

export class DeleteEventByIdController {
  constructor(
    private readonly deleteEventByIdUsecase: DeleteEventByIdUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        throw new MissingParameters("Event Id");
      }
      await this.deleteEventByIdUsecase.execute(eventId);
      const viewmodel = new DeleteEventByIdViewmodel(
        "Evento deletado com sucesso."
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
