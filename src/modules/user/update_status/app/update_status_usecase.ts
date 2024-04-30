import { User } from "../../../../shared/domain/entities/user";
import { STATUS } from "../../../../shared/domain/enums/status_enum";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";

export class UpdateStatusUsecase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string, status: STATUS): Promise<User> {
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        user.setStatus(status);

        return this.userRepository.updateStatus(id, status);
    }
}