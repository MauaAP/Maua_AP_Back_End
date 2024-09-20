import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class GetAllUsersToPresenceListUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = this.repo.getAll();
    if (!users) {
      throw new NoItemsFound("users");
    }
    return users;
  }
}
