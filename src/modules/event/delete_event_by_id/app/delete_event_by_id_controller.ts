import { Request, Response } from "express";
import { DeleteEventByIdUsecase } from "./delete_event_by_id_usecase";
import { DeleteEventByIdViewmodel } from "./delete_event_by_id_viewmodel";
import { ForbiddenAction, NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";
import { MissingParameters, WrongTypeParameters } from "../../../../shared/helpers/errors/controller_errors";

export class DeleteEventByIdController {
  constructor(
    private readonly deleteEventByIdUsecase: DeleteEventByIdUsecase
  ) {}

  async handle(req: Request, res: Response) {
    try {
      await this.deleteEventByIdUsecase.execute(req.params.id);
      const viewmodel = new DeleteEventByIdViewmodel(
        "Evento deletado com sucesso."
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
