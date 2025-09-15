import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { GenerateAllCertificatesUsecase } from "./generate_all_certificates_usecase";

export class GenerateAllCertificatesController {
  constructor(
    private generateAllCertificatesUsecase: GenerateAllCertificatesUsecase
  ) {}

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

      const pdfBuffer = await this.generateAllCertificatesUsecase.execute(
        userId
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="all_certificates_${userId}.pdf"`
      );

      return res.status(200).send(pdfBuffer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
