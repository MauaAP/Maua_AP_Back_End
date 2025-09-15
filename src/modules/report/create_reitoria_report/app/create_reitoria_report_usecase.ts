import puppeteer from "puppeteer";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import {
  getReitoriaReportHtml,
  ReitoriaReportInfo,
} from "../../../../shared/utils/html_reitoria_report";
import { Event } from "../../../../shared/domain/entities/event";

let pLimit: any;

export class CreateReitoriaReportUsecase {
  constructor(
    private eventRepository: IEventRepository,
    private presenceRepository: IPresenceRepository
  ) {
    (async () => {
      pLimit = (await import("p-limit")).default;
    })();
  }

  async execute(): Promise<Buffer> {
    const events: Event[] = await this.eventRepository.getAll();

    const limit = pLimit(5);

    const activities = events.map((event) =>
      limit(async () => {
        if (!event.props.eventId) {
          throw new NoItemsFound("Event ID not found");
        }
        const professors = await this.presenceRepository.countPresencesByEventId(
          event.props.eventId
        );

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
      })
    );

    const resolvedActivities = await Promise.all(activities);

    const grandTotal = {
      professors: resolvedActivities.reduce((acc, act) => acc + act.professors, 0),
      technicalStaff: resolvedActivities.reduce(
        (acc, act) => acc + act.technicalStaff,
        0
      ),
      collaborators: resolvedActivities.reduce(
        (acc, act) => acc + act.collaborators,
        0
      ),
      students: resolvedActivities.reduce((acc, act) => acc + act.students, 0),
      total: resolvedActivities.reduce((acc, act) => acc + act.total, 0),
    };

    const reportInfo: ReitoriaReportInfo = {
      totalEvents: events.length,
      activities: resolvedActivities,
      grandTotal,
    };

    const htmlString = getReitoriaReportHtml(reportInfo);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();

    return pdfBuffer;
  }
}
