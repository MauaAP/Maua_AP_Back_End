import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import {
  JsonInfo,
  getCertificateHtml,
} from "../../../../shared/utils/html_certificate";
import { saveCertificate } from "../../../../shared/infra/repositories/certificate_repository_s3";
import puppeteer, { executablePath } from "puppeteer";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";

export class CreateCertificateUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}


  private executablePathVariable: string = "";

  async execute(presenceId: string) {

    if (process.env.IS_LOCAL) {
      this.executablePathVariable = puppeteer.executablePath();
    } else {
      this.executablePathVariable = "/usr/bin/google-chrome";
    }

    console.log(`Usando o Chrome em AQUI CLOUDWATCH: ${this.executablePathVariable}`);


    const presence = await this.presenceRepository.getPresenceById(presenceId);

    if (!presence) {
      throw new NoItemsFound("presence");
    }
    const userId = presence.userId;
    const eventId = presence.eventId;

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NoItemsFound("Usuário não encontrado");
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    const eventDate =
      new Date(event.date).getDate() +
      "/" +
      (new Date(event.date).getMonth() + 1) +
      "/" +
      new Date(event.date).getFullYear();
    const json: JsonInfo = {
      name: user.name,
      manager: event.manager,
      eventName: event.eventName,
      date: eventDate,
      local: event.local,
      dateNow: new Date().getDate().toString(),
      monthNow: (new Date().getMonth() + 1).toString(),
      yearNow: new Date().getFullYear().toString(),
      initTime:
        new Date(event.initTime).getHours().toString() +
        ":" +
        new Date(event.initTime).getMinutes().toString(),
      finishTime:
        new Date(event.finishTime).getHours().toString() +
        ":" +
        new Date(event.finishTime).getMinutes().toString(),
    };

    const htmlString = getCertificateHtml(json);

    const browser = await puppeteer.launch({
      executablePath: this.executablePathVariable,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();

    const certificateUrl = await saveCertificate(userId, eventId, pdfBuffer);
    return certificateUrl;
  }
}
