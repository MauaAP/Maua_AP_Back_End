import { Request, Response } from "express";
import { GetEventByIdUsecase } from "./get_event_by_id_usecase";
import { GetEventByIdViewmodel } from "./get_event_by_id_viewmodel";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import {
  BadRequest,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class GetEventByIdController {
  constructor(private getEventByIdUsecase: GetEventByIdUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const eventId: string = req.params.eventId;
      if (!eventId) {
        throw new MissingParameters("Event");
      }
      if (!req.params) {
        throw new InvalidRequest("Invalid Request");
      }
      const event = await this.getEventByIdUsecase.execute(eventId);
      const viewmodel = new GetEventByIdViewmodel(event);
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof InvalidParameter) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof NoItemsFound) {
        return new BadRequest(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
