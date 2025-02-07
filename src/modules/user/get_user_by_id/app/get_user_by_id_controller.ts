import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { getUserByIdUsecase } from "./get_user_by_id_usecase";
import { GetUserByIdViewmodel } from "./get_user_by_id_viewmodel";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { BadRequest, Forbidden, InternalServerError, ParameterError } from "../../../../shared/helpers/http/http_codes";
import { InvalidRequest } from "../../../../shared/helpers/errors/controller_errors";

export class GetUserByIdController {
  constructor(private getUserByIdUsecase: getUserByIdUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId;

      const user = await this.getUserByIdUsecase.execute(userId);

      const userViewModel = new GetUserByIdViewmodel(user);

      return res.status(200).json(userViewModel);
    }  catch (error: any) {
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
