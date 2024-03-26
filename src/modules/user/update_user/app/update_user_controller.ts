import { Request, Response } from "express";
import { User } from "../../../../shared/domain/entities/user";
import { UpdateUserUsecase } from "./update_user_usecase";
import {
  MissingParameters,
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.body.name) {
        throw new MissingParameters("name");
      }
      if (!req.body.email) {
        throw new MissingParameters("email");
      }
      if (!req.body.role) {
        throw new MissingParameters("role");
      }
      if (!req.body.password) {
        throw new MissingParameters("password");
      }

      const user = new User(req.body);
      const updatedUser = await this.updateUserUseCase.execute(user);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error in handle:", error);
      if (error instanceof NoItemsFound) {
        return new NoItemsFound(error.message);
      }
      if (error instanceof MissingParameters) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof WrongTypeParameters) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof EntityError) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: error.message });
    }
  }
}
