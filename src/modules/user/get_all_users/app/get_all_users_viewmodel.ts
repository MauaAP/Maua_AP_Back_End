import { User } from "../../../../shared/domain/entities/user";

export class GetAllUsersViewmodel {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;

  constructor(user: User) {
    this.id = user.userId ?? '';
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
  }
}
