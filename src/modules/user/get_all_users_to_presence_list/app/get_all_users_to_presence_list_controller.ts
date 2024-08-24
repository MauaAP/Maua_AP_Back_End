import { Request, Response } from "express";
import { GetAllUsersToPresenceListUsecase } from "./get_all_users_to_presence_list_usecase";
import { GetAllUsersToPresenceListViewmodel } from "./get_all_users_to_presence_list_viewmodel";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidParameter,
  InvalidRequest,
} from "../../../../shared/helpers/errors/controller_errors";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../../shared/helpers/http/http_codes";

export class GetAllUsersToPresenceListController {
  constructor(private usecase: GetAllUsersToPresenceListUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const users = await this.usecase.execute();
      const usersViewModel = users.map(
        (user) => new GetAllUsersToPresenceListViewmodel(user)
      );
      res.status(200).json(usersViewModel);
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
