import { Request, Response } from "express";
import { CreateUserUsecase } from "./create_user_usecase";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { ForbiddenAction, NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserProps } from "../../../../shared/domain/entities/user";
import { MissingParameters } from "../../../../shared/helpers/errors/controller_errors";

export class CreateUserController {
  constructor(private createUserUsecase: CreateUserUsecase) {}

  async createUser(req: Request, res: Response) {
    try {
      console.log("TENTANDO CRIAR USUÁRIO");
      const { name, email, role, password } = req.body;

      const errors = [];

      if (!name) {
        errors.push(new MissingParameters("Name"));
      }

      if (!email) {
        errors.push(new MissingParameters("Email"));
      }

      if (!password) {
        errors.push(new MissingParameters("Password"));
      }

      if (!role) {
        errors.push(new MissingParameters("Role"));
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const userProps: UserProps = { name, email, role, password };
      const newUser = await this.createUserUsecase.execute(userProps);

      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof NoItemsFound || error instanceof EntityError) {
        return res.status(400).json(new BadRequest(error.message));
      }
      if (error instanceof ForbiddenAction) {
        return res.status(403).json(new Forbidden(error.message));
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
