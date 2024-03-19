import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";

export class GetAllUsersUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = this.repo.getAll();
    return users;
  }
}
