import { Request, Response } from "express";
import { CreateUserUsecase } from "./create_user_usecase";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import { UserProps } from "../../../../shared/domain/entities/user";
import {
  InvalidParameter,
  InvalidRequest,
  MissingParameters,
} from "../../../../shared/helpers/errors/controller_errors";
import { CreateUserViewModel } from "./create_user_viewmodel";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class CreateUserController {
  constructor(private createUserUsecase: CreateUserUsecase) {}

  async createUser(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "SECRETARY", "MODERATOR"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new Forbidden(
          "You do not have permission to access this feature"
        );
      }
      
      const { name, email, role, password, telefone, cpf, status } = req.body;

      if (!name) {
        throw new MissingParameters("Name");
      }

      if (!email) {
        throw new MissingParameters("Email");
      }

      if (!password) {
        throw new MissingParameters("Password");
      }

      if (!role) {
        throw new MissingParameters("Role");
      }

      if (!status) {
        throw new MissingParameters("Status");
      }

      if (!telefone) {
        throw new MissingParameters("Telefone");
      }

      if (!cpf) {
        throw new MissingParameters("CPF");
      }

      const userProps: UserProps = {
        name,
        email,
        role,
        password,
        telefone,
        cpf,
        status,
      };
      await this.createUserUsecase.execute(userProps);

      const viewModel = new CreateUserViewModel(
        "Usuário cadastrado com sucesso!"
      );
      res.status(201).json(viewModel);
    } catch (error: any) {
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof InvalidParameter) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof Forbidden) {
        return new Forbidden(error.getMessage()).send(res);
      }
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof ConflictItems) {
        return new ConflictItems(error.message);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
