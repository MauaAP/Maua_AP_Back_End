import { Express, Request, Response } from "express";
import CreateUserPresenter from "../modules/user/create_user/app/create_user_presenter";
import AuthUserPresenter from "../modules/user/auth_user/app/auth_user_presenter";
import GetAllUserPresenter from "../modules/user/get_all_users/app/get_all_users_presenter";
import GetUserByEmailPresenter from "../modules/user/get_user_by_email/app/get_user_by_email_presenter";
import CreateEventPresenter from "../modules/event/create_event/app/create_event_presenter";
import GetAllEventsPresenter from "../modules/event/get_all_events/app/get_all_events_presenter";
import GetEventByIdPresenter from "../modules/event/get_event_by_id/app/get_event_by_id_presenter";

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
  app.use("/api", CreateUserPresenter);
  app.use("/api", AuthUserPresenter);
  app.use("/api", GetAllUserPresenter);
  app.use("/api", GetUserByEmailPresenter);

  // event routes
  app.use("/api", CreateEventPresenter);
  app.use("/api", GetAllEventsPresenter);
  app.use("/api", GetEventByIdPresenter);
};

export default routes;
