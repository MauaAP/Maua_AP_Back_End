import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { ListCertificatesS3Usecase } from "./list_certificates_s3_usecase";

export class ListCertificatesS3Controller {
  constructor(private listCertificatesS3Usecase: ListCertificatesS3Usecase) {}

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

      const orderBy = req.query.orderBy as string | undefined;
      const certificates = await this.listCertificatesS3Usecase.execute(userId, orderBy);
      return res.status(200).json(certificates);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
