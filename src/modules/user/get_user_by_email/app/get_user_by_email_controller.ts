import { Request, Response } from "express";
import { GetUserByEmailUseCase } from "./get_user_by_email_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetUserByEmailViewmodel } from "./get_user_by_email_viewmodel";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { InvalidRequest } from "../../../../shared/helpers/errors/controller_errors";

export class GetUserByEmailController {
  constructor(private getUserByEmailUseCase: GetUserByEmailUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      const email = userFromToken.email;

      const user = await this.getUserByEmailUseCase.execute(email);
      if (!user) {
        throw new NoItemsFound("user");
      }
      const userViewModel = new GetUserByEmailViewmodel(user);

      return res.status(200).json(userViewModel);
    } catch (error: any) {
      if (error instanceof NoItemsFound || error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof NoItemsFound) {
        return new Forbidden(error.message).send(res);
      }
      return new InternalServerError(error.message).send(res);
    }
  }
}
