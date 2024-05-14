import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllUsersToPresenceListUsecase } from "./get_all_users_to_presence_list_usecase";
import { GetAllUsersToPresenceListViewmodel } from "./get_all_users_to_presence_list_viewmodel";
import {
  ForbiddenAction,
  NoItemsFound,
} from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";

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
      if (error instanceof NoItemsFound) {
        return res.status(204).json({ error: error.message });
      }
      if (
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof ForbiddenAction) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
