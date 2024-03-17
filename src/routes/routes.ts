import { Express, Request, Response } from "express";
import CreateUserRoutes from "../modules/user/create_user/create_user_routes";

const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) => res.status(200).send("Api AP"));

  app
    .route("/teste")
    .get((req: Request, res: Response) =>
      res.status(200).send("Hello, world!")
    );

  app.use("/api", CreateUserRoutes);
};

export default routes;
