import { Request, Response } from "express";
import { CreateEventUsecase } from "./create_event_usecase";
import { CreateEventViewmodel } from "./create_event_viemodel";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class CreateEventController {
  constructor(private createEventUsecase: CreateEventUsecase) {}

  async createEvent(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }

      console.log("ATTEMPTING TO CREATE EVENT");
      const {
        eventName,
        date,
        host,
        manager,
        hostEmail,
        hostPhone,
        local,
        modality,
        targetAudience,
        activityType,
        goals,
        period,
        contentActivities,
        developedCompetencies,
        initTime,
        finishTime,
      } = req.body;

      if (!eventName) {
        throw new MissingParameters("Event Name");
      }
      if (!date) {
        throw new MissingParameters("Date");
      }
      if (!host) {
        throw new MissingParameters("Host");
      }
      if (!manager) {
        throw new MissingParameters("Manager");
      }
      if (!hostEmail) {
        throw new MissingParameters("Host Email");
      }
      if (!hostPhone) {
        throw new MissingParameters("Host Phone");
      }
      if (!local) {
        throw new MissingParameters("Local");
      }
      if (!modality) {
        throw new MissingParameters("Modality");
      }
      if (!targetAudience) {
        throw new MissingParameters("Target Audience");
      }
      if (!activityType) {
        throw new MissingParameters("Activity Type");
      }
      if (!goals) {
        throw new MissingParameters("Goals");
      }
      if (!period) {
        throw new MissingParameters("Period");
      }
      if (!contentActivities) {
        throw new MissingParameters("Content Activities");
      }
      if (!developedCompetencies) {
        throw new MissingParameters("Developed Competencies");
      }
      if (!initTime) {
        throw new MissingParameters("Init Time");
      }
      if (!finishTime) {
        throw new MissingParameters("Finish Time");
      }

      

      const eventProps = {
        eventName,
        date,
        host,
        manager,
        hostEmail,
        hostPhone,
        local,
        modality: modality.toUpperCase(),
        targetAudience,
        activityType,
        goals,
        period,
        contentActivities,
        developedCompetencies,
        initTime,
        finishTime,
      };

      await this.createEventUsecase.execute(eventProps);

      const viewmodel = new CreateEventViewmodel("Evento criado com sucesso!");
      return res.status(201).json(viewmodel);
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
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof ConflictItems) {
        return new ConflictItems(error.message);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
