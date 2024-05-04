import { Request, Response } from "express";
import { CreateCertificateUsecase } from "./create_certificate_usecase";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class CreateCertificateController {
    constructor(private createCertificateUseCase: CreateCertificateUsecase ) {}

    async handle(req: Request, res: Response){
        try {
            const userFromToken = req.user as UserFromToken;
            if(!userFromToken){
                return res.status(401).json({error: "Token not found"})
            }
            const presenceId = req.params.presenceId
            
            if(!presenceId){
                return res.status(422).json({error: "Missing presence id"})
            }

            await this.createCertificateUseCase.execute(presenceId)
            return res.status(201).json({message: "testando foiii"})
        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}