import express, { Request, Response } from "express";
import { GetTreinamentoPrintPresencasUsecase } from "./get_treinamento_print_presencas_usecase";
import { GetTreinamentoPrintPresencasController } from "./get_treinamento_print_presencas_controller";

const router = express.Router();
const usecase = new GetTreinamentoPrintPresencasUsecase();
const controller = new GetTreinamentoPrintPresencasController(usecase);

router.get("/presences/treinamento-print", async (req: Request, res: Response) => {
  await controller.handle(req, res);
});

export default router;
