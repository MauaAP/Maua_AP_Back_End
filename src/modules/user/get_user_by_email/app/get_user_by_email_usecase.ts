import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class GetUserByEmailUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string): Promise<User | undefined> {
    if (!User.isValidEmail(email)) {
      throw new EntityError("email");
    }
    return this.repo.getUserByEmail(email);
  }
}
