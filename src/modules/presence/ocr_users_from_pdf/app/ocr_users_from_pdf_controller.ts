import { Request, Response } from "express";
import { OcrUsersFromPdfUsecase } from "./ocr_users_from_pdf_usecase";

export class OcrUsersFromPdfController {
  constructor(private usecase: OcrUsersFromPdfUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Arquivo PDF não enviado" });
      }
      const buffer = req.file.buffer;
      const result = await this.usecase.execute(buffer);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
