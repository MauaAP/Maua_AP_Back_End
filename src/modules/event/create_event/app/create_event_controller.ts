import { Request, Response } from "express";
import { CreateEventUsecase } from "./create_event_usecase";
import { CreateEventViewmodel } from "./create_event_viemodel";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class CreateEventController {
  constructor(private createEventUsecase: CreateEventUsecase) {}

  async createEvent(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
      if (!allowedRoles.includes(userFromToken.role)) {
        return res.status(403).json({ error: "Acesso negado." });
      }
      const {
        eventName,
        date,
        host,
        manager,
        duration,
        hostEmail,
        hostPhone,
        local,
        modality,
        targetAudience,
        activityType,
        goals,
        contentActivities,
        developedCompetencies,
        initTime,
        finishTime,
      } = req.body;

      const errors = [];

      if (!eventName) {
        errors.push("Missing event name");
      }
      if (!date) {
        errors.push("Missing date");
      }
      if (!host) {
        errors.push("Missing host");
      }
      if (!manager) {
        errors.push("Missing manager");
      }
      if (!duration) {
        errors.push("Missing duration");
      }
      if (!hostEmail) {
        errors.push("Missing host email");
      }
      if (!hostPhone) {
        errors.push("Missing host phone");
      }
      if (!local) {
        errors.push("Missing local");
      }
      if (!modality) {
        errors.push("Missing modality");
      }
      if (!targetAudience) {
        errors.push("Missing target audience");
      }
      if (!activityType) {
        errors.push("Missing activity type");
      }
      if (!goals) {
        errors.push("Missing goals");
      }
      if (!contentActivities) {
        errors.push("Missing content activities");
      }
      if (!developedCompetencies) {
        errors.push("Missing developed competencies");
      }
      if (!initTime) {
        errors.push("Missing init time");
      }
      if (!finishTime) {
        errors.push("Missing finish time");
      }
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }
      const eventProps = {
        eventName,
        date,
        host,
        manager,
        duration,
        hostEmail,
        hostPhone,
        local,
        modality,
        targetAudience,
        activityType,
        goals,
        contentActivities,
        developedCompetencies,
        initTime,
        finishTime,
      };
      await this.createEventUsecase.execute(eventProps);

      const viewmodel = new CreateEventViewmodel("Evento criado com sucesso!");
      res.status(201).json(viewmodel);
    } catch (error: any) {
      if (
        error instanceof BadRequest ||
        error instanceof Forbidden ||
        error instanceof InternalServerError
      ) {
        return res.status(error.status).json(error);
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
