import express, { Request, Response } from "express";
import multer from "multer";
import { UserRepositoryPrisma } from "../../../../shared/infra/repositories/user_repository_prisma";
import { GetUsersFromPdfUsecase } from "./get_users_from_pdf_usecase";
import { GetUsersFromPdfController } from "./get_users_from_pdf_controller";

const upload = multer();
const router = express.Router();

const userRepository = new UserRepositoryPrisma();
const getUsersFromPdfUsecase = new GetUsersFromPdfUsecase(userRepository);
const getUsersFromPdfController = new GetUsersFromPdfController(getUsersFromPdfUsecase);

router.post(
  "/users/from-pdf",
  upload.single("file"), // campo "file" no multipart/form-data
  async (req: Request, res: Response) => {
    await getUsersFromPdfController.handle(req, res);
  }
);

export default router;
