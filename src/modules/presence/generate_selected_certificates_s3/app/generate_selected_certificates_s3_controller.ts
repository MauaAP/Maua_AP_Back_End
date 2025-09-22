import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { GenerateSelectedCertificatesS3Usecase } from "./generate_selected_certificates_s3_usecase";

export class GenerateSelectedCertificatesS3Controller {
  constructor(private generateSelectedCertificatesS3Usecase: GenerateSelectedCertificatesS3Usecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        return res.status(403).json({ error: "No permission" });
      }
      
      let userId = "";

      if (userFromToken.role === "ADMIN") {
        userId = req.query.userId as string;
      } else {
        userId = userFromToken.id;
      }
      
      const presenceIds = req.body.presenceIds as string[];
      if (!presenceIds || !Array.isArray(presenceIds)) {
        return res.status(400).json({ error: "presenceIds must be an array" });
      }
      const result = await this.generateSelectedCertificatesS3Usecase.execute(userId, presenceIds);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
