import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { GenerateAllCertificatesS3Usecase } from "./generate_all_certificates_s3_usecase";

export class GenerateAllCertificatesS3Controller {
  constructor(private generateAllCertificatesS3Usecase: GenerateAllCertificatesS3Usecase) {}

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

      const result = await this.generateAllCertificatesS3Usecase.execute(userId);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
