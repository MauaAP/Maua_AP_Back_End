import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { GenerateSelectedCertificatesUsecase } from "./generate_selected_certificates_usecase";

export class GenerateSelectedCertificatesController {
  constructor(private generateSelectedCertificatesUsecase: GenerateSelectedCertificatesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        return res.status(403).json({ error: "No permission" });
      }
      const userId = userFromToken.id;
      const presenceIds = req.body.presenceIds as string[];
      if (!presenceIds || !Array.isArray(presenceIds)) {
        return res.status(400).json({ error: "presenceIds must be an array" });
      }
      const result = await this.generateSelectedCertificatesUsecase.execute(userId, presenceIds);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
