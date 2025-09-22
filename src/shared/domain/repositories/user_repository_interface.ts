import { User } from "../entities/user";
import { STATUS } from "../enums/status_enum";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAll(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  updateStatus(id: String, status: STATUS): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  getUsersByName(name: string): Promise<User[]>;
}
