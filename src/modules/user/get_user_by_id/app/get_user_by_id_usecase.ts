import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class getUserByIdUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (user === undefined) {
        throw new NoItemsFound(id);
      }
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por id:", error);
      throw new Error("Erro ao buscar usuário por id");
    }
  }
}
