import puppeteer from "puppeteer";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import {
  getReitoriaReportHtml,
  ReitoriaReportInfo,
} from "../../../../shared/utils/html_reitoria_report";
import {
  saveReitoriaReport,
  saveReport,
} from "../../../../shared/infra/repositories/certificate_repository_s3";
import { Event } from "../../../../shared/domain/entities/event";

export class CreateReitoriaReportUsecase {
  constructor(private eventRepository: IEventRepository) {}

  async execute() {
    const events: Event[] = await this.eventRepository.getAll();

    const activities = events.map((event: Event) => {
      const professors = event.props.host.split(",").length;
      const technicalStaff = event.props.manager.length;
      const collaborators = event.props.hostEmail.length;
      const students = 0;
      const total = professors + technicalStaff + collaborators + students;

      return {
        event: event.props.eventName,
        professors,
        technicalStaff,
        collaborators,
        students,
        total,
      };
    });

    const grandTotal = {
      professors: activities.reduce((acc, act) => acc + act.professors, 0),
      technicalStaff: activities.reduce(
        (acc, act) => acc + act.technicalStaff,
        0
      ),
      collaborators: activities.reduce(
        (acc, act) => acc + act.collaborators,
        0
      ),
      students: activities.reduce((acc, act) => acc + act.students, 0),
      total: activities.reduce((acc, act) => acc + act.total, 0),
    };

    const reportInfo: ReitoriaReportInfo = {
      totalEvents: events.length,
      activities,
      grandTotal,
    };

    const date = new Date().toISOString();

    const htmlString = getReitoriaReportHtml(reportInfo);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();

    const reportUrl = await saveReitoriaReport(date, pdfBuffer);

    // Isso com certeza é a coisa mais gambiarra que você desenvolvedor atual do projeto verá!
    // Mas é o que temos para hoje, infelizmente.
    // Se arrumar, glória eterna para o senhor! Absolute Cinema! Adeus!
    const antesPontoCom = reportUrl.split(".com/")[0];
    const depoisPontoCom = reportUrl.split(".com/")[1];
    const formattedReportUrl = `${antesPontoCom}.com/relatorios-reitoria/${depoisPontoCom}`;

    return formattedReportUrl;
  }
}
