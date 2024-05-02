import { Request, Response } from "express";
import {
  ForbiddenAction,
  NoItemsFound,
} from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import {
  MissingParameters,
  WrongTypeParameters,
} from "../../../../shared/helpers/errors/controller_errors";

import { DeletePresenceByIdUsecase } from "./delete_presence_by_id_usecase";
import { DeletePresenceByIdViewmodel } from "./delete_presence_by_id_viewmodel";

export class deletePresenceByIdController {
  constructor(
    private readonly deletePresenceByIdUsecase: DeletePresenceByIdUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.params) {
        throw new MissingParameters("Não foi informado parametros.");
      }
      if (!req.params.id) {
        throw new MissingParameters("Id da presença não informado.");
      }

      await this.deletePresenceByIdUsecase.execute(req.params.id);
      const viewmodel = new DeletePresenceByIdViewmodel(
        "Presença deletada com sucesso."
      );
      res.status(201).json(viewmodel);
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return res.status(404).json({ error: error.message });
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof ForbiddenAction) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
