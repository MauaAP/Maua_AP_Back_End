import { User, UserProps } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";

export class CreateUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(userProps: UserProps) {
    if (!userProps.name) {
      throw new Error("Missing name");
    }
    if (!userProps.email) {
      throw new Error("Missing email");
    }
    if (!userProps.password) {
      throw new Error("Missing password");
    }
    if (!userProps.role) {
      throw new Error("Missing role");
    }

    const newUser = await this.repo.createUser(new User(userProps));
    return newUser;
  }
}
