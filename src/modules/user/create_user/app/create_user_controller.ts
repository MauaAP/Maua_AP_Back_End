import { Request, Response } from "express";
import { CreateUserUsecase } from "./create_user_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  ForbiddenAction,
  NoItemsFound,
} from "../../../../shared/helpers/errors/usecase_errors";
import {
  NotFound,
  BadRequest,
  Forbidden,
  InternalServerError,
} from "http-errors";

export class CreateUserController {
  static async createUser(req: Request, res: Response) {
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
        return res
          .status(400)
          .json(errors.map((error) => ({ message: error.message })));
      }

      const createUserUsecase = new CreateUserUsecase();
      const newUser = await createUserUsecase.createUser({
        name,
        email,
        role,
        password,
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return res.status(404).json(new NotFound(error.message));
      }
      if (error instanceof MissingParameters) {
        return res.status(400).json(new BadRequest(error.message));
      }
      if (error instanceof WrongTypeParameters) {
        return res.status(400).json(new BadRequest(error.message));
      }
      if (error instanceof EntityError) {
        return res.status(400).json(new BadRequest(error.message));
      }
      if (error instanceof ForbiddenAction) {
        return res.status(403).json(new Forbidden(error.message));
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
