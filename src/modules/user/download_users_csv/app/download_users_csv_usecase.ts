import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { User } from "../../../../shared/domain/entities/user";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class DownloadUsersCsvUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.getAll();
    if (!users) {
      throw new NoItemsFound("users");
    }
    return users;
  }
}
