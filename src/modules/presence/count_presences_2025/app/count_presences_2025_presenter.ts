import express, { Request, Response } from "express";
import { CountPresences2025Usecase } from "./count_presences_2025_usecase";
import { CountPresences2025Controller } from "./count_presences_2025_controller";

const router = express.Router();

const usecase = new CountPresences2025Usecase();
const controller = new CountPresences2025Controller(usecase);

router.get("/presences/count/2025", async (req: Request, res: Response) => {
  await controller.handle(req, res);
});

export default router;
