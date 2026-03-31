import { Request, Response } from "express";
import type { UpdateEventCompetenciesUsecase } from "./update_event_competencies_usecase";
import { normalizeDevelopedCompetencies } from "../../../../shared/utils/developed_competencies";

export class UpdateEventCompetenciesController {
  constructor(private usecase: UpdateEventCompetenciesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const raw = req.body?.developedCompetencies ?? req.body?.competencies;
      const developedCompetencies = normalizeDevelopedCompetencies(raw);
      if (!eventId) {
        return res.status(400).json({ error: "Missing eventId" });
      }
      if (!developedCompetencies) {
        return res.status(400).json({
          error:
            "Missing developedCompetencies (string CSV ou array de strings). Aceita também o campo 'competencies'.",
        });
      }
      await this.usecase.execute(eventId, developedCompetencies);
      return res.status(200).json({
        message: "Competências atualizadas com sucesso",
        developedCompetencies,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
