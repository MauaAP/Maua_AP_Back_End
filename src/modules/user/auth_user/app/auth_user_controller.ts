import { AuthUserUsecase } from "./auth_user_usecase";
import { Request, Response } from "express";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { BadRequest, InternalServerError } from "http-errors";
import jwt from "jsonwebtoken";
import { ParameterError } from "../../../../shared/helpers/http/http_codes";
import { InvalidCredentialsError } from "../../../../shared/helpers/errors/login_errors";

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
        {
          id: user.userId,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      res.status(200).json({ token });
    } catch (error: any) {
      if (error instanceof NoItemsFound || error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof InvalidCredentialsError) {
        return new BadRequest(error.message).send(res);
      }
      return new InternalServerError(error.message).send(res);
    }
  }
}
