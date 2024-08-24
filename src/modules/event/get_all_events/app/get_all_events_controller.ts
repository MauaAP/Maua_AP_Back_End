import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllEventsViewmodel } from "./get_all_events_viewmodel";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidParameter,
  InvalidRequest,
} from "../../../../shared/helpers/errors/controller_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { GetAllEventsUsecase } from "./get_all_events_usecase";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";

export class GetAllEventsController {
  constructor(private repo: GetAllEventsUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if (!userFromToken) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }

      const events = await this.repo.execute();
      const viewmodel = events.map((event) => new GetAllEventsViewmodel(event));
      res.status(200).json(viewmodel);
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
