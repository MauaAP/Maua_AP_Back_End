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

// export class CreateReitoriaReportUsecase {
//   constructor(private eventRepository: IEventRepository, private presenceRepository: IPresenceRepository) {}

//   async execute() {
//     const events: Event[] = await this.eventRepository.getAll();


//     const activities = events.map( async (event: Event) => {

//       if (!event.props.eventId) {
//         throw new NoItemsFound("Event not found");
//       }
//       const professors = await this.presenceRepository.countPresencesByEventId(event.props.eventId);
//       console.log('aquiiiii' , event.eventName,  professors )


//       const technicalStaff = event.props.manager.length;
//       const collaborators = event.props.hostEmail.length;
//       const students = 0;
//       const total = professors + technicalStaff + collaborators + students;

//       return {
//         event: event.props.eventName,
//         professors,
//         technicalStaff,
//         collaborators,
//         students,
//         total,
//       };
//     });

//     const resolvedActivities = await Promise.all(activities);

//     const grandTotal = {
//       professors: resolvedActivities.reduce((acc, act) => acc + act.professors, 0),
//       technicalStaff: resolvedActivities.reduce(
//         (acc, act) => acc + act.technicalStaff,
//         0
//       ),
//       collaborators: resolvedActivities.reduce(
//         (acc, act) => acc + act.collaborators,
//         0
//       ),
//       students: resolvedActivities.reduce((acc, act) => acc + act.students, 0),
//       total: resolvedActivities.reduce((acc, act) => acc + act.total, 0),
//     };

//     const reportInfo: ReitoriaReportInfo = {
//       totalEvents: events.length,
//       activities: resolvedActivities,
//       grandTotal,
//     };

//     const date = new Date().toISOString();

//     const htmlString = getReitoriaReportHtml(reportInfo);

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox"],
//     });
//     const page = await browser.newPage();
//     await page.setContent(htmlString);

//     const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

//     await browser.close();

//     const reportUrl = await saveReitoriaReport(date, pdfBuffer);

//     // Isso com certeza é a coisa mais gambiarra que você desenvolvedor atual do projeto verá!
//     // Mas é o que temos para hoje, infelizmente.
//     // Se arrumar, glória eterna para o senhor! Absolute Cinema! Adeus!
//     const antesPontoCom = reportUrl.split(".com/")[0];
//     const depoisPontoCom = reportUrl.split(".com/")[1];
//     const formattedReportUrl = `${antesPontoCom}.com/relatorios-reitoria/${depoisPontoCom}`;

//     return formattedReportUrl;
//   }
// }


let pLimit: any;

export class CreateReitoriaReportUsecase {
  constructor(
    private eventRepository: IEventRepository,
    private presenceRepository: IPresenceRepository
  ) {
    (async () => {
      pLimit = (await import('p-limit')).default;
    })();
  }

  async execute() {
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

    const date = new Date().toISOString();

    const htmlString = getReitoriaReportHtml(reportInfo);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });

    await browser.close();

    const reportUrl = await saveReitoriaReport(date, pdfBuffer);

    const antesPontoCom = reportUrl.split('.com/')[0];
    const depoisPontoCom = reportUrl.split('.com/')[1];
    const formattedReportUrl = `${antesPontoCom}.com/relatorios-reitoria/${depoisPontoCom}`;

    return formattedReportUrl;
  }
}
