import { Request, Response } from "express";
import { CreateUserUsecase } from "./create_user_usecase";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserProps } from "../../../../shared/domain/entities/user";
import { MissingParameters } from "../../../../shared/helpers/errors/controller_errors";
import { CreateUserViewModel } from "./create_user_viewmodel";

export class CreateUserController {
  constructor(private createUserUsecase: CreateUserUsecase) {}

  async createUser(req: Request, res: Response) {
    try {
      console.log("TENTANDO CRIAR USUÁRIO");
      const { name, email, role, password, telefone, cpf, registration, status } =
        req.body;

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
      if (!status) {
        errors.push(new MissingParameters("Status"));
      }

      if (!telefone) {
        errors.push(new MissingParameters("Telefone"));
      }

      if (!cpf) {
        errors.push(new MissingParameters("CPF"));
      }

      if (!registration) {
        errors.push(new MissingParameters("Registration"));
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const userProps: UserProps = {
        name,
        email,
        role,
        password,
        telefone,
        cpf,
        registration,
        status,
      };
      await this.createUserUsecase.execute(userProps);

      const viewModel = new CreateUserViewModel(
        "Usuário cadastrado com sucesso!"
      );
      res.status(201).json(viewModel);
    } catch (error: any) {
      if (
        error instanceof BadRequest ||
        error instanceof Forbidden ||
        error instanceof InternalServerError
      ) {
        return res.status(error.status).json(error);
      }
      return res.status(500).json(new InternalServerError(error.message));
    }
  }
}
