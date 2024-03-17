import { User } from "../entities/user";

export interface IUserRepository {

  createUser(user: User): Promise<User>;

}
