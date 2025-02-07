import { Request, Response } from "express";
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
import { CreateExternalCertificateUsecase } from "./create_external_certificate_usecase";

export class CreateExternalCertificateController {
  constructor(private usecase: CreateExternalCertificateUsecase) {}

  async handle(req: Request, res: Response) {
    try {

      const presenceId = req.params.presenceId;

      if (!presenceId) {
        throw new BadRequest("Missing presence id").send(res);
      }

      const certificateUrl = await this.usecase.execute(
        presenceId
      );
      return res
        .status(201)
        .json({ message: "Certificate created successfully", certificateUrl });
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
