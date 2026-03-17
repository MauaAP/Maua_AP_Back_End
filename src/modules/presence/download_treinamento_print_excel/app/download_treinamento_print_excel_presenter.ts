import express, { Request, Response } from "express";
import { GetTreinamentoPrintPresencasUsecase } from "../../get_treinamento_print_presencas/app/get_treinamento_print_presencas_usecase";
import { DownloadTreinamentoPrintExcelUsecase } from "./download_treinamento_print_excel_usecase";
import { DownloadTreinamentoPrintExcelController } from "./download_treinamento_print_excel_controller";

const router = express.Router();
const getPresencasUsecase = new GetTreinamentoPrintPresencasUsecase();
const downloadExcelUsecase = new DownloadTreinamentoPrintExcelUsecase(getPresencasUsecase);
const controller = new DownloadTreinamentoPrintExcelController(downloadExcelUsecase);

router.get("/presences/treinamento-print/excel", async (req: Request, res: Response) => {
  await controller.handle(req, res);
});

router.get("/presences/treinamento-print/excel/baixar", (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const downloadUrl = `${baseUrl}/api/presences/treinamento-print/excel`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Download</title></head><body><p>Iniciando download...</p><script>window.location.href="${downloadUrl}";</script><p>Se o download não iniciar, <a href="${downloadUrl}">clique aqui</a>.</p></body></html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
