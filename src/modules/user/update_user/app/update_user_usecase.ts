import { User } from "../../../../shared/domain/entities/user";
import { ROLE } from "../../../../shared/domain/enums/role_enum";
import { STATUS } from "../../../../shared/domain/enums/status_enum";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class UpdateUserUsecase {
    constructor(private repo: IUserRepository) {}

    async execute(id: string, name: string, email: string, telefone: string, cpf: string, role: ROLE, status: STATUS) {
        if(name){
            if(User.isValidName(name) === false){
                throw new EntityError("Nome inválido.");
            }
        }
        if(email){
            if(User.isValidEmail(email) === false){
                throw new EntityError("Email inválido.");
            }
        }
        if(telefone){
            if(User.validatePhoneNumber(telefone) === false){
                throw new EntityError("Telefone inválido.");
            }
        }
        if(cpf){
            if(User.validateCPF(cpf) === false){
                throw new EntityError("CPF inválido.");
            }
        }
        if(role){
            if(User.validateRole(role) === false){
                throw new EntityError("Role do usuário inválida.");
            }
        }
        if(status){
            if(User.validatestatus(status) === false){
                throw new EntityError("Status do usuário inválido.");
            }
        }
        return await this.repo.updateUser(id, {name, email, telefone, cpf, role, status});
    }
}