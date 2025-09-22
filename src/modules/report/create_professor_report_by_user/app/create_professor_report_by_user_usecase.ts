import puppeteer from "puppeteer";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { Presence } from "../../../../shared/domain/entities/presence";
import {
  getProfessorReportHtml,
  ProfessorReportInfo,
} from "../../../../shared/utils/html_professor_report";
import { saveReportIfNotExists } from "../../../../shared/infra/repositories/certificate_repository_s3";

export class CreateProfessorReportByUserUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(professorId: string) {
    const user = await this.userRepository.getUserById(professorId);

    if (!user) {
      throw new NoItemsFound("Professor");
    }

    const presences = await this.presenceRepository.getAllPresencesByUserId(
      professorId
    );
    const events = await Promise.all(
      presences.map((p: Presence) =>
        this.eventRepository.getEventById(p.eventId)
      )
    );

    const activities = events.map((event) => ({
      date: new Date(event.date).toLocaleDateString(),
      time: formatTime(
        new Date(event.initTime).getHours(),
        new Date(event.initTime).getMinutes()
      ),
      duration: formatDuration(
        new Date(event.initTime),
        new Date(event.finishTime)
      ),
      event: event.eventName,
    }));

    const instructorActivities = activities.filter((a) =>
      a.event.includes("Instrutor")
    );

    const reportInfo: ProfessorReportInfo = {
      professorName: user.name,
      activities,
      instructorActivities,
      totalActivities: activities.length,
      totalInstructorActivities: instructorActivities.length,
      dateNow: new Date().getDate().toString(),
      monthNow: (new Date().getMonth() + 1).toString(),
      yearNow: new Date().getFullYear().toString(),
    };

    const htmlString = getProfessorReportHtml(reportInfo);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();

    const reportUrl = await saveReportIfNotExists(professorId, pdfBuffer);

    // Isso com certeza é a coisa mais gambiarra que você desenvolvedor atual do projeto verá!
    // Mas é o que temos para hoje, infelizmente.
    // Se arrumar, glória eterna para o senhor! Absolute Cinema! Adeus!
    const antesPontoCom = reportUrl.split(".com/")[0];
    const depoisPontoCom = reportUrl.split(".com/")[1];
    const formattedReportUrl = `${antesPontoCom}.com/relatorios/${depoisPontoCom}`;

    return formattedReportUrl;
  }
}

function formatTime(hours: number, minutes: number): string {
  return minutes === 0 ? `${hours}h` : `${hours}h${minutes}`;
}

function formatDuration(startTime: Date, endTime: Date): string {
  let startHours = startTime.getHours();
  let startMinutes = startTime.getMinutes();
  let endHours = endTime.getHours();
  let endMinutes = endTime.getMinutes();

  let totalHours = endHours - startHours;
  let totalMinutes = endMinutes - startMinutes;

  if (totalMinutes < 0) {
    totalMinutes += 60;
    totalHours -= 1;
  }

  if (totalHours > 0 && totalMinutes > 0) {
    return `${totalHours}h ${totalMinutes}min`;
  } else if (totalHours > 0) {
    return `${totalHours}h`;
  } else {
    return `${totalMinutes}min`;
  }
}
