import { Request, Response } from "express";
import { CreateReitoriaReportUsecase } from "./create_reitoria_report_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";

export class CreateReitoriaReportController {
  constructor(private usecase: CreateReitoriaReportUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }

      const reportUrl = await this.usecase.execute();
      return res
        .status(201)
        .json({ message: "Reitoria report created successfully", reportUrl });
    } catch (error: any) {
      console.log('erro ', error)
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
      // Se não for nenhum dos erros conhecidos, retorna erro interno
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
