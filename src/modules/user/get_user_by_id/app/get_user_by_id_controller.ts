import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import { getUserByIdUsecase } from "./get_user_by_id_usecase";
import { GetUserByIdViewmodel } from "./get_user_by_id_viewmodel";

export class GetUserByIdController {
  constructor(private getUserByIdUsecase: getUserByIdUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId;

      const user = await this.getUserByIdUsecase.execute(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userViewModel = new GetUserByIdViewmodel(user);

      return res.status(200).json(userViewModel);
    } catch (error: any) {
      console.error("Error in handle:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}
