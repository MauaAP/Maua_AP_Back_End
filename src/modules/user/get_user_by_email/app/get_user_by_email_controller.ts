import { Request, Response } from "express";
import { GetUserByEmailUseCase } from "./get_user_by_email_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware"; 
import { GetUserByEmailViewmodel } from "./get_user_by_email_viewmodel"; 

export class GetUserByEmailController {
  constructor(private getUserByEmailUseCase: GetUserByEmailUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken; 
      const email = userFromToken.email; 

      const user = await this.getUserByEmailUseCase.execute(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userViewModel = new GetUserByEmailViewmodel(user);

      return res.status(200).json(userViewModel);
    } catch (error: any) {
      console.error("Error in handle:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}
