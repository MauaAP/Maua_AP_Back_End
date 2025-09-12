import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { GenerateAllCertificatesUsecase } from "./generate_all_certificates_usecase";

export class GenerateAllCertificatesController {
  constructor(private generateAllCertificatesUsecase: GenerateAllCertificatesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        return res.status(403).json({ error: "No permission" });
      }
      const userId = userFromToken.id;
      const result = await this.generateAllCertificatesUsecase.execute(userId);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
