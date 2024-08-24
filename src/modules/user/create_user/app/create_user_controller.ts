import { Request, Response } from "express";
import { CreateUserUsecase } from "./create_user_usecase";
import { BadRequest, Forbidden, InternalServerError } from "http-errors";
import { UserProps } from "../../../../shared/domain/entities/user";
import { InvalidParameter, InvalidRequest, MissingParameters } from "../../../../shared/helpers/errors/controller_errors";
import { CreateUserViewModel } from "./create_user_viewmodel";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";
import { ParameterError } from "../../../../shared/helpers/http/http_codes";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class CreateUserController {
  constructor(private createUserUsecase: CreateUserUsecase) {}

  async createUser(req: Request, res: Response) {
    try {
      console.log("TENTANDO CRIAR USUÁRIO");
      const { name, email, role, password, telefone, cpf, status } =
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
        status,
      };
      await this.createUserUsecase.execute(userProps);

      const viewModel = new CreateUserViewModel(
        "Usuário cadastrado com sucesso!"
      );
      res.status(201).json(viewModel);
    }  catch (error: any) {
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
      if(error instanceof ConflictItems) {
        return new ConflictItems(error.message);
      }
      return new InternalServerError('Internal Server Error').send(res);
    }
  }
}
