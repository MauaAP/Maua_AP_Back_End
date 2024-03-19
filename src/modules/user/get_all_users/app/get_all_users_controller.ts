import { GetAllUsersUsecase } from "./get_all_users_usecase";
import { Request, Response } from "express";
import { authenticateAdminToken } from "../../../../shared/middlewares/jwt_admin_middleware";

export class GetAllUsersController {
  constructor(private usecase: GetAllUsersUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      authenticateAdminToken(req, res, async () => {
        const users = await this.usecase.execute();
        res.status(200).send(users);
      });
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}
