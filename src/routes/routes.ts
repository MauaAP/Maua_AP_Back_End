import express, { Express, Request, Response } from "express";
import { CreateUserController } from "../modules/user/create_user/app/create_user_controller";
import CreateUserRoutes from "../modules/user/create_user/create_user_routes";

const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) => res.status(200).send("Api AP"));

  //teste
  app
    .route("/teste")
    .get((req: Request, res: Response) =>
      res.status(200).send("Hello, world!")
    );

  // rota post
  app.use("/api", CreateUserRoutes);
};

export default routes;
