import { AuthUserUsecase } from "./auth_user_usecase";
import { Request, Response } from "express";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { BadRequest, InternalServerError } from "http-errors";
import jwt from "jsonwebtoken";

export class AuthUserController {
  constructor(private usecase: AuthUserUsecase) {}

  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        throw new BadRequest("Email and password are required");
      }

      const user = await this.usecase.execute(email, password);

      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      res.status(200).json({ token });
    } catch (error: any) {
      if (error instanceof NoItemsFound || error instanceof EntityError) {
        return res.status(400).json(new BadRequest(error.message));
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
