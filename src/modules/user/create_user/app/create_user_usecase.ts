import { User, UserProps } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class CreateUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(userProps: UserProps) {
    if (!User.isValidName(userProps.name)) {
      throw new EntityError("name");
    }
    if (!User.isValidEmail(userProps.email)) {
      throw new EntityError("email");
    }
    if (!User.isValidPassword(userProps.password)) {
      throw new EntityError("password");
    }
    if (!User.validateRole(userProps.role)) {
      throw new EntityError("role");
    }

    if (!userProps.cpf || !User.validateCPF(userProps.cpf)) {
      throw new EntityError("cpf");
    }
    if (!User.validatestatus(userProps.status)) {
      throw new EntityError("status");
    }

    const newUser = await this.repo.createUser(new User(userProps));
    return newUser;
  }
}
