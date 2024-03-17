import express from "express";
import { CreateUserController } from "../create_user/app/create_user_controller";

const router = express.Router();

router.post("/create-user", CreateUserController.createUser);

export default router;
