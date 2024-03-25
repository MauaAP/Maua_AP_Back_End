import { GetAllUsersUsecase } from "./get_all_users_usecase";
import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { GetAllUsersViewmodel } from "./get_all_users_viewmodel";

export class GetAllUsersController {
  constructor(private usecase: GetAllUsersUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken; 

      if (userFromToken.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Acesso negado." });
      }

      const users = await this.usecase.execute();
      const usersViewModel = users.map(
        (user) => new GetAllUsersViewmodel(user)
      );
      res.status(200).json(usersViewModel);
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}
