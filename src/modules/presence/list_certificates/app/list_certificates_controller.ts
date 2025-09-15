import { Request, Response } from "express";
import { UserFromToken } from "../../../../shared/middlewares/jwt_middleware";
import type { ListCertificatesUsecase } from "./list_certificates_usecase";

export class ListCertificatesController {
  constructor(private listCertificatesUsecase: ListCertificatesUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;
      if (!userFromToken) {
        return res.status(403).json({ error: "No permission" });
      }
      const userId = userFromToken.id;
      const orderBy = req.query.orderBy as string | undefined;
      const certificates = await this.listCertificatesUsecase.execute(userId, orderBy);
      return res.status(200).json(certificates);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
