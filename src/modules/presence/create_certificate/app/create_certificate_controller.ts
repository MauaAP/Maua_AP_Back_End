import { Request, Response } from "express";
import { CreateCertificateUsecase } from "./create_certificate_usecase";
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
export class CreateCertificateController {
  constructor(private createCertificateUseCase: CreateCertificateUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }

      const presenceId = req.params.presenceId;
      if (!presenceId) {
        return new BadRequest("Missing presence id").send(res);
      }

      const pdfBuffer = await this.createCertificateUseCase.execute(presenceId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificate_${presenceId}.pdf"`
      );

      return res.status(200).send(pdfBuffer);
    } catch (error: any) {
      console.error("ERROR: ", error);
      console.error("Stack Trace:", error.stack);

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
