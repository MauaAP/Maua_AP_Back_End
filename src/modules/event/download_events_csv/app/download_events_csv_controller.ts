import { Request, Response } from "express";
import { parse } from "json2csv";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { DownloadEventsCsvUsecase } from "./download_events_csv_usecase";

export class GetAllEventsController {
  constructor(private usecase: DownloadEventsCsvUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }
      const events = await this.usecase.execute();

      const csv = parse(events, {
        fields: ["eventName", "date", "host", "manager", "cpf", "manager", "local", "activityType"],
      });

      res.header("Content-Type", "text/csv");
      res.header("Content-Disposition", "attachment; filename=events.csv");
      return res.status(200).send(csv);
    } catch (error: any) {
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof Forbidden) {
        return new Forbidden(error.getMessage()).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
