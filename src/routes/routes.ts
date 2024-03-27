import { Express, Request, Response } from "express";
import CreateUserRoutes from "../modules/user/create_user/create_user_routes";
import AuthUserRoutes from "../modules/user/auth_user/auth_user_routes";
import GetAllUserRoutes from "../modules/user/get_all_users/get_all_users_routes"
import GetUserByEmailRoutes from "../modules/user/get_user_by_email/get_user_by_email_routes";
const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) => res.status(200).send("Api AP"));

  app
    .route("/teste")
    .get((req: Request, res: Response) =>
      res.status(200).send("Hello, world!")
    );

    // user routes

  app.use("/api", CreateUserRoutes);
  app.use("/api", AuthUserRoutes);
  app.use("/api", GetAllUserRoutes);
  app.use("/api", GetUserByEmailRoutes)

  
};

export default routes;
