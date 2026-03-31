import { Request, Response } from "express";
import { parse } from "json2csv";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import {
  InvalidRequest,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { DownloadEventsCsvUsecase } from "./download_events_csv_usecase";
import { EVENT_CSV_FIELD_NAMES } from "../../../../shared/utils/event_csv_export_mapper";

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
      const rows = await this.usecase.execute();

      const csv = parse(rows, {
        fields: [...EVENT_CSV_FIELD_NAMES],
      });

      res.header("Content-Type", "text/csv; charset=utf-8");
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
