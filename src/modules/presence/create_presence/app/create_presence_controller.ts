import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { CreatePresenceViewModel } from "./create_presence_viewmodel";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { CreatePresenceUsecase } from "./create_presence_usecase";

export class CreatePresenceController {
  constructor(private createPresenceUseCase: CreatePresenceUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        return res.status(401).json({ error: "Token not found" });
      }
      const userId = req.body.userid;
      const eventId = req.body.eventid;

      console.log("UserID from request:", userId);
      console.log("EventID from request:", eventId);

      const errors = [];

      if (!userId) {
        errors.push("Missing user id");
      }
      if (!eventId) {
        errors.push("Missing event id");
      }

      await this.createPresenceUseCase.execute(userId, eventId);
      const presenceViewModel = new CreatePresenceViewModel(
        "Presença registrada!"
      );

      return res.status(200).json(presenceViewModel);
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
