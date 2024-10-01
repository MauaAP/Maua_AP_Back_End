import { Request, Response } from "express";
import { CreateProfessorReportByUserUsecase } from "./create_professor_report_by_user_usecase";
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

export class CreateProfessorReportByUserController {
  constructor(private usecase: CreateProfessorReportByUserUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }
      const professorId = req.params.userId;

      if (!professorId) {
        throw new BadRequest("Missing professor id").send(res);
      }

      const reportUrl = await this.usecase.execute(professorId);
      return res
        .status(201)
        .json({ message: "Professor report created successfully", reportUrl });
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
