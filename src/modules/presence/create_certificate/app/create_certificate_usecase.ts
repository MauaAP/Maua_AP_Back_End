import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { saveCertificateIfNotExists } from "../../../../shared/infra/repositories/certificate_repository_s3";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { NoItemsFound } from "../../../../shared/helpers/errors/usecase_errors";
import { JsonInfo, getCertificateHtml, getCertificateBackHtml } from "../../../../shared/utils/html_certificate";

export class CreateCertificateUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(presenceId: string) {
    const presence = await this.presenceRepository.getPresenceById(presenceId);
    if (!presence) throw new NoItemsFound("presence");

    const userId = presence.userId;
    const eventId = presence.eventId;

    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NoItemsFound("Usuário não encontrado");

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) throw new Error("Evento não encontrado");

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
      developedCompetencies: event.developedCompetencies,
    };

    // ============ GERAR PDF FRENTE ============
    const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(getCertificateHtml(json), { waitUntil: "networkidle" });

    const pdfFront = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // ============ GERAR PDF VERSO ============
    const pageBack = await browser.newPage();
    await pageBack.setContent(getCertificateBackHtml(json), { waitUntil: "networkidle" });

    const pdfBack = await pageBack.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ============ CONCATENAR PDFs ============
    const mergedPdf = await PDFDocument.create();

    const frontDoc = await PDFDocument.load(pdfFront);
    const backDoc = await PDFDocument.load(pdfBack);

    const [frontPage] = await mergedPdf.copyPages(frontDoc, [0]);
    mergedPdf.addPage(frontPage);

    const [backPage] = await mergedPdf.copyPages(backDoc, [0]);
    mergedPdf.addPage(backPage);

    const finalPdf = await mergedPdf.save();

    // ============ SALVAR ============
    const certificateUrl = await saveCertificateIfNotExists(userId, eventId, Buffer.from(finalPdf));
    return certificateUrl;
  }
}
