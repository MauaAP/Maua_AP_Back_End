import { User } from "../../../../shared/domain/entities/user";
import { STATUS } from "../../../../shared/domain/enums/status_enum";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class UpdateStatusUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, status: STATUS): Promise<User> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NoItemsFound("user");
    }

    if (User.validatestatus(status)) {
      throw new EntityError("status");
    }

    user.setStatus(status);

    return this.userRepository.updateStatus(id, status);
  }
}
