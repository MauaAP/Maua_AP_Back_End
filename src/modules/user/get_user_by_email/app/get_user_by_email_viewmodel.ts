import { User } from "../../../../shared/domain/entities/user";

export class GetUserByEmailViewmodel {
    id: string;
    name: string;
    email: string;
    role: string;
    telefone?: string;
    cpf?: string;
    status: string;
    
    constructor(user: User) {
        this.id = user.userId ?? '';
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.telefone = user.telefone;
        this.cpf = user.cpf;
        this.status = user.status;
    }
}