import { Request, Response } from "express";
import { CreatePresenceViewModel } from "./create_presence_viewmodel";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { CreatePresenceUsecase } from "./create_presence_usecase";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class CreatePresenceController {
  constructor(private createPresenceUseCase: CreatePresenceUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      // const userFromToken = req.user as UserFromToken;
      // if (!userFromToken) {
      //   return res.status(401).json({ error: "Token not found" });
      // }
      const userId = req.body.userid;
      const eventId = req.body.eventid;

      if (!userId) {
        throw new MissingParameters("Missing Event Name");
      }
      if (!eventId) {
        throw new MissingParameters("Missing Date");
      }

      await this.createPresenceUseCase.execute(userId, eventId);
      const presenceViewModel = new CreatePresenceViewModel(
        "Presença registrada!"
      );

      return res.status(200).json(presenceViewModel);
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
