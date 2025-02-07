import { compare } from "bcryptjs";
import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  InvalidCredentialsError,
  PasswordDoesNotMatchError,
} from "../../../../shared/helpers/errors/login_errors";

export class AuthUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string, password: string) {
    if (!User.isValidEmail(email)) {
      throw new EntityError("email");
    }

    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return user;
  }
}
