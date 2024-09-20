import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class getUserByIdUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NoItemsFound("id");
    }
    return user;
  }
}
