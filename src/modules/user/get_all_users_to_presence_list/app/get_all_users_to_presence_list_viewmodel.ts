import { User } from "../../../../shared/domain/entities/user";

export class GetAllUsersToPresenceListViewmodel {
  id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.userId ?? "";
    this.name = user.name;
    this.email = user.email;
  }
}
