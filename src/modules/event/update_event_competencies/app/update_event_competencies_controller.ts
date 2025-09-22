import { Request, Response } from "express";
import type { UpdateEventCompetenciesUsecase } from "./update_event_competencies_usecase";

export class UpdateEventCompetenciesController {
  constructor(private usecase: UpdateEventCompetenciesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const { developedCompetencies } = req.body;
      if (!eventId || !developedCompetencies) {
        return res.status(400).json({ error: "Missing eventId or developedCompetencies" });
      }
      await this.usecase.execute(eventId, developedCompetencies);
      return res.status(200).json({ message: "Competências atualizadas com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
