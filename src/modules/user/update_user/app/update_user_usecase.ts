import { User } from "../../../../shared/domain/entities/user";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";

export class UpdateUserUsecase {
    constructor(private repo: IUserRepository) {}

    async execute(user: User): Promise<User> {
        return this.repo.updateUser(user);
    }
}