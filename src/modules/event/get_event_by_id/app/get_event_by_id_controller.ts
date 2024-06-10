import { Request, Response } from "express";
import { GetEventByIdUsecase } from "./get_event_by_id_usecase";
import { GetEventByIdViewmodel } from "./get_event_by_id_viewmodel";

export class GetEventByIdController {
  constructor(private getEventByIdUsecase: GetEventByIdUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const eventId: string = req.params.eventId;
      const event = await this.getEventByIdUsecase.execute(eventId);
      const viewmodel = new GetEventByIdViewmodel(event);
      return res.status(200).json(viewmodel);
    } catch (error: any) {
      console.error("Erro ao buscar evento por ID:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
