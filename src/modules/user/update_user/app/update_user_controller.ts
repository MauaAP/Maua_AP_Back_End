import { Request, Response } from "express";
import { UpdateUserUsecase } from "./update_user_usecase";
import { User } from "../../../../shared/domain/entities/user";
import { BadRequest, Forbidden, InternalServerError, OK, ParameterError } from "../../../../shared/helpers/http/http_codes";
import { UpdateStatusViewmodel } from "../../update_status/app/update_status_viewmodel";
import { InvalidParameter, InvalidRequest, MissingParameters } from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { ConflictItems } from "../../../../shared/helpers/errors/usecase_errors";

export class UpdateUserController {
    constructor(private usecase: UpdateUserUsecase) {}

    async handle(req: Request, res: Response) {
        try {
            const {id, name, email, telefone, cpf, role, status} = req.body;

            if(id == undefined) {
                throw new MissingParameters("Não é possível atualizar o id do usuário");
            };
            
            if(name == undefined && email == undefined && telefone == undefined && cpf == undefined && role == undefined && status == undefined) {
                throw new MissingParameters("name, email, telefone, cpf, role or status");
            }

            await this.usecase.execute(id, name, email, telefone, cpf, role, status);
            const viewmodel = new UpdateStatusViewmodel("Usuário atualizado com sucesso");

            return res.status(201).json(viewmodel);
        } catch (error:any) {
            if (error instanceof InvalidRequest) {
                return new BadRequest(error.message).send(res);
            }
            if (error instanceof InvalidParameter) {
                return new ParameterError(error.message).send(res);
            }
            if (error instanceof EntityError) {
                return new ParameterError(error.message).send(res);
            }
            if (error instanceof Forbidden) {
                return new Forbidden(error.getMessage()).send(res);
            }
            if (error instanceof MissingParameters) {
                return new ParameterError(error.message).send(res);
            }
            if (error instanceof ConflictItems) {
                return new ConflictItems(error.message);
            }
                return new InternalServerError("Internal Server Error").send(res);
        }
    }
}