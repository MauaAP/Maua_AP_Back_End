import { Request, Response } from "express";
import { GetAllPresencesUsecase } from "./get_all_presences_usecase";
import { GetAllPresencesViewmodel } from "./get_all_presences_viewmodel";
import {
  ParameterError,
  BadRequest,
  InternalServerError,
  Forbidden,
} from "../../../../shared/helpers/http/http_codes";
import {
  InvalidParameter,
  InvalidRequest,
} from "../../../../shared/helpers/errors/controller_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";

export class GetAllPresencesController {
  constructor(private getAllPresencesUsecase: GetAllPresencesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      var userId = "";
      if(userFromToken.role === "PROFESSOR"){
        userId = userFromToken.id
      }
      const presences = await this.getAllPresencesUsecase.execute(userId);
      // console.log(presences)
      const viewmodel = presences.map(
        (presence) => new GetAllPresencesViewmodel(presence).toJSON()
      );
      // console.log(viewmodel)
      return res.status(200).json(viewmodel);
    } catch (error: any) {
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
      if (error instanceof NoItemsFound) {
        return new Forbidden(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
      
    }
  }
}
