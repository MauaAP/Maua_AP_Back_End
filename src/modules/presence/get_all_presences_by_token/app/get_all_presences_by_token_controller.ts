import { Request, Response } from "express";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllPresencesByUserUsecase } from "./get_all_presences_by_token_usecase";
import { GetAllPresencesByUserViewmodel } from "./get_all_presences_by_token_viewmodel";
import {
  InvalidParameter,
  InvalidRequest,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class GetAllPresencesByUserController {
  constructor(private repo: GetAllPresencesByUserUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      if (!req.headers) {
        throw new Forbidden("You don't have permission to access this project");
      }

      if (!userFromToken) {
        throw new Forbidden("You don't have permission to access this project");
      }

      const userId: string = userFromToken.id;
      const presences = await this.repo.execute(userId);
      const viewmodel = presences.map(
        (presence) => new GetAllPresencesByUserViewmodel(presence)
      );
      return res.status(200).json(viewmodel);
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
      if (error instanceof NoItemsFound) {
        return new Forbidden(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
