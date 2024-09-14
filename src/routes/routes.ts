import { Express, Request, Response } from "express";
import CreateUserPresenter from "../modules/user/create_user/app/create_user_presenter";
import AuthUserPresenter from "../modules/user/auth_user/app/auth_user_presenter";
import GetAllUsersPresenter from "../modules/user/get_all_users/app/get_all_users_presenter";
import GetAllUsersToPresenceListPresenter from "../modules/user/get_all_users_to_presence_list/app/get_all_users_to_presence_list_presenter";
import GetUserByEmailPresenter from "../modules/user/get_user_by_email/app/get_user_by_email_presenter";
import GetUserByIdPresenter from "../modules/user/get_user_by_id/app/get_user_by_id_presenter";
import DownloadUsersCsvPresenter from "../modules/user/download_users_csv/app/download_users_csv_presenter";
import UpdateStatusPresenter from "../modules/user/update_status/app/update_status_presenter";
import CreateEventPresenter from "../modules/event/create_event/app/create_event_presenter";
import GetAllEventsPresenter from "../modules/event/get_all_events/app/get_all_events_presenter";
import GetEventByIdPresenter from "../modules/event/get_event_by_id/app/get_event_by_id_presenter";
import DeleteEventByIdPresenter from "../modules/event/delete_event_by_id/app/delete_event_by_id_presenter";
import DownloadEventsCsvPresenter from "../modules/event/download_events_csv/app/download_events_csv_presenter";
import CreatePresencePresenter from "../modules/presence/create_presence/app/create_presence_presenter";
import GetAllPresencesByEventPresenter from "../modules/presence/get_all_presences_by_event/app/get_all_presences_by_event_presenter";
import GetAllPresencesByTokenPresenter from "../modules/presence/get_all_presences_by_token/app/get_all_presences_by_token_presenter";
import GetAllPresencesPresenter from "../modules/presence/get_all_presences/app/get_all_presences_presenter";
import GetPresenceByIdPresenter from "../modules/presence/get_presence_by_id/app/get_presence_by_id_presenter";
import DeletePresenceByIdPresenter from "../modules/presence/delete_presence_by_id/app/delete_presence_by_id_presenter";
import CreateCertificatePresenter from "../modules/presence/create_certificate/app/create_certificate_presenter";

import app from "../app";

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
  app.use("/api", GetAllUsersPresenter);
  app.use("/api", GetAllUsersToPresenceListPresenter);
  app.use("/api", GetUserByEmailPresenter);
  app.use("/api", GetUserByIdPresenter);
  app.use("/api", UpdateStatusPresenter);
  app.use("/api", DownloadUsersCsvPresenter);

  // event routes
  app.use("/api", CreateEventPresenter);
  app.use("/api", GetAllEventsPresenter);
  app.use("/api", GetEventByIdPresenter);
  app.use("/api", DeleteEventByIdPresenter);
  app.use("/api", DownloadEventsCsvPresenter);

  // presence routes
  app.use("/api", CreatePresencePresenter);
  app.use("/api", GetAllPresencesByEventPresenter);
  app.use("/api", GetAllPresencesByTokenPresenter);
  app.use("/api", GetAllPresencesPresenter);
  app.use("/api", GetPresenceByIdPresenter);
  app.use("/api", DeletePresenceByIdPresenter);
  app.use("/api", CreateCertificatePresenter);
};

export default routes;
