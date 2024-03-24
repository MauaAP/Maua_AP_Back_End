import { GetAllUsersUsecase } from "./get_all_users_usecase";
import { Request, Response } from "express";
import { authenticateAdminToken } from "../../../../shared/middlewares/jwt_admin_middleware";
import { User } from "../../../../shared/domain/entities/user";
import { GetAllUsersViewmodel } from "./get_all_users_viewmodel";

export class GetAllUsersController {
  constructor(private usecase: GetAllUsersUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      authenticateAdminToken(req, res, async () => {
        const users = await this.usecase.execute();
        const usersViewModel = users.map(
          (user) => new GetAllUsersViewmodel(user)
        );
        res.status(200).json(usersViewModel);
      });
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}
