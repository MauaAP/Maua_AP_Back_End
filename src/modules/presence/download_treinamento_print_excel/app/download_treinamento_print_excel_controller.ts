import { Request, Response } from "express";
import { DownloadTreinamentoPrintExcelUsecase } from "./download_treinamento_print_excel_usecase";
import { InternalServerError } from "../../../../shared/helpers/http/http_codes";

export class DownloadTreinamentoPrintExcelController {
  constructor(private usecase: DownloadTreinamentoPrintExcelUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const buffer = await this.usecase.execute();
      const filename = "treinamento_print_presencas.xlsx";
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.setHeader("Content-Length", String(buffer.length));
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      return res.status(200).send(buffer);
    } catch {
      return new InternalServerError("Erro ao gerar o Excel.").send(res);
    }
  }
}
