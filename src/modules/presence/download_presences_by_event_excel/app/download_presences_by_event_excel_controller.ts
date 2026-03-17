import { Request, Response } from "express";
import { DownloadPresencesByEventExcelUsecase } from "./download_presences_by_event_excel_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  ParameterError,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import {
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";

export class DownloadPresencesByEventExcelController {
  constructor(private usecase: DownloadPresencesByEventExcelUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden("You don't have permission to access this resource");
      }

      if (!req.params.eventId) {
        throw new MissingParameters("eventId");
      }

      const eventId = req.params.eventId;
      const buffer = await this.usecase.execute(eventId);

      const filename = `presencas_evento_${eventId}.xlsx`;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.setHeader("Content-Length", String(buffer.length));
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      return res.status(200).send(buffer);
    } catch (error: any) {
      if (error instanceof Forbidden) {
        return new Forbidden(error.getMessage()).send(res);
      }
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      return new InternalServerError("Erro ao gerar o Excel de presenças.").send(res);
    }
  }
}
