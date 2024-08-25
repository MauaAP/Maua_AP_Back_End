import { Request, Response } from "express";
import { GetAllPresencesByEventUsecase } from "./get_all_presences_by_event_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { GetAllPresencesByEventViewmodel } from "./get_all_presences_by_event_viewmodel";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";

export class GetAllPresencesByEventController {
  constructor(
    private getAllPresencesByEventUsecase: GetAllPresencesByEventUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden("You don't have permission to access this project");
      }
      if (!req.params.eventId) {
        throw new MissingParameters("Missing user id");
      }
      if (!req.params) {
        throw new MissingParameters("Not found date");
      }

      const eventId: string = req.params.eventId;
      const presences = await this.getAllPresencesByEventUsecase.execute(
        eventId
      );
      const viewmodel = presences.map(
        (presence) => new GetAllPresencesByEventViewmodel(presence)
      );
      return res.status(200).json(viewmodel);
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
