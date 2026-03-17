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
import UpdateEventCompetenciesPresenter from "../modules/event/update_event_competencies/app/update_event_competencies_presenter";
import UpdateEventPresenter from "../modules/event/update_event/app/update_event_presenter";
import CreatePresencePresenter from "../modules/presence/create_presence/app/create_presence_presenter";
import CreateExternalPresencePresenter from "../modules/presence/create_external_presence/app/create_external_presence_presenter";
import GetAllPresencesByEventPresenter from "../modules/presence/get_all_presences_by_event/app/get_all_presences_by_event_presenter";
import GetTreinamentoPrintPresencasPresenter from "../modules/presence/get_treinamento_print_presencas/app/get_treinamento_print_presencas_presenter";
import DownloadTreinamentoPrintExcelPresenter from "../modules/presence/download_treinamento_print_excel/app/download_treinamento_print_excel_presenter";
import GetAllPresencesByTokenPresenter from "../modules/presence/get_all_presences_by_token/app/get_all_presences_by_token_presenter";
import GetAllPresencesPresenter from "../modules/presence/get_all_presences/app/get_all_presences_presenter";
import GetPresenceByIdPresenter from "../modules/presence/get_presence_by_id/app/get_presence_by_id_presenter";
import DeletePresenceByIdPresenter from "../modules/presence/delete_presence_by_id/app/delete_presence_by_id_presenter";
import CreateCertificatePresenter from "../modules/presence/create_certificate/app/create_certificate_presenter";
import CreateExternalCertificatePresenter from "../modules/presence/create_external_certificate/app/create_external_certificate_presenter";
import CreateProfessorReportPresenter from "../modules/report/create_professor_report_by_token/app/create_professor_report_presenter";
import CreateProfessorReportByUserPresenter from "../modules/report/create_professor_report_by_user/app/create_professor_report_by_user_presenter";
import CreateReitoriaReportPresenter from "../modules/report/create_reitoria_report/app/create_reitoria_report_presenter";  
import UpdateUserPresenter from '../modules/user/update_user/app/update_user_presenter';
import ListCertificatesS3Presenter from "../modules/presence/list_certificates_s3/app/list_certificates_s3_presenter";
import GenerateAllCertificatesS3Presenter from "../modules/presence/generate_all_certificates_s3/app/generate_all_certificates_s3_presenter";
import GenerateSelectedCertificatesS3Presenter from "../modules/presence/generate_selected_certificates_s3/app/generate_selected_certificates_s3_presenter";
import DownloadPresencesByEventExcelPresenter from "../modules/presence/download_presences_by_event_excel/app/download_presences_by_event_excel_presenter";
import CountPresences2025Presenter from "../modules/presence/count_presences_2025/app/count_presences_2025_presenter";
import UsersFromPDFPresenter from "../modules/user/get_users_from_pdf/app/get_users_from_pdf_presenter";
import GetActiveQuestionsPresenter from "../modules/evaluation/get_active_questions/app/get_active_questions_presenter";
import CreateQuestionPresenter from "../modules/evaluation/create_question/app/create_question_presenter";
import CreateEvaluationPresenter from "../modules/evaluation/create_evaluation/app/create_evaluation_presenter";
import UpdateEvaluationPresenter from "../modules/evaluation/update_evaluation/app/update_evaluation_presenter";
import GetEvaluationsByEventPresenter from "../modules/evaluation/get_evaluations_by_event/app/get_evaluations_by_event_presenter";

const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) => res.status(200).send("Api AP - V2"));

  // user routes
  app.use("/api", CreateUserPresenter);
  app.use("/api", AuthUserPresenter);
  app.use("/api", GetAllUsersPresenter);
  app.use("/api", GetAllUsersToPresenceListPresenter);
  app.use("/api", GetUserByEmailPresenter);
  app.use("/api", GetUserByIdPresenter);
  app.use("/api", UpdateStatusPresenter);
  app.use("/api", DownloadUsersCsvPresenter);
  app.use("/api", UpdateUserPresenter);
  app.use("/api", UsersFromPDFPresenter);

  // event routes
  app.use("/api", CreateEventPresenter);
  app.use("/api", GetAllEventsPresenter);
  app.use("/api", GetEventByIdPresenter);
  app.use("/api", DeleteEventByIdPresenter);
  app.use("/api", DownloadEventsCsvPresenter);
  app.use("/api", UpdateEventCompetenciesPresenter);
  app.use("/api", UpdateEventPresenter);

  // presence routes
  app.use("/api", CreatePresencePresenter);
  app.use("/api", GetAllPresencesByEventPresenter);
  app.use("/api", DownloadTreinamentoPrintExcelPresenter);
  app.use("/api", GetTreinamentoPrintPresencasPresenter);
  app.use("/api", GetAllPresencesByTokenPresenter);
  app.use("/api", GetAllPresencesPresenter);
  app.use("/api", GetPresenceByIdPresenter);
  app.use("/api", DeletePresenceByIdPresenter);
  app.use("/api", CreateCertificatePresenter);
  app.use("/api", ListCertificatesS3Presenter);
  app.use("/api", GenerateAllCertificatesS3Presenter);
  app.use("/api", GenerateSelectedCertificatesS3Presenter);
  app.use("/api", DownloadPresencesByEventExcelPresenter);
  app.use("/api", CountPresences2025Presenter);

  // external presence routes
  app.use("/api", CreateExternalPresencePresenter);
  app.use("/api", CreateExternalCertificatePresenter);

  // evaluation routes
  app.use("/api", GetActiveQuestionsPresenter);
  app.use("/api", CreateQuestionPresenter);
  app.use("/api", CreateEvaluationPresenter);
  app.use("/api", UpdateEvaluationPresenter);
  app.use("/api", GetEvaluationsByEventPresenter);

  // report routes
  app.use("/api", CreateProfessorReportPresenter);
  app.use("/api", CreateProfessorReportByUserPresenter);
  app.use("/api", CreateReitoriaReportPresenter);
};

export default routes;
