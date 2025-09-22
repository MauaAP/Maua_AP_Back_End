import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import {
  JsonInfo,
  getCertificateHtml,
} from "../../../../shared/utils/html_certificate";
import {
  saveCertificate,
  saveCertificateExternal,
  getCertificateExternalS3Url,
  saveCertificateExternalIfNotExists,
} from "../../../../shared/infra/repositories/certificate_repository_s3";
import puppeteer from "puppeteer";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { IExternalPresenceRepository } from "../../../../shared/domain/repositories/external_presence_interface";

export class CreateExternalCertificateUsecase {
  constructor(
    private externalPresenceRepository: IExternalPresenceRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(presenceId: string) {
    const presence =
      await this.externalPresenceRepository.getExternalPresenceById(presenceId);

    if (!presence) {
      throw new NoItemsFound("presence");
    }

    const email = presence.email;

    const eventId = presence.eventId;

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
      name: presence.name,
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

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();

    // Salva o certificado no S3 e retorna a URL garantida
    const certificateUrl = await saveCertificateExternalIfNotExists(email, eventId, pdfBuffer);
    return certificateUrl;
  }
}
