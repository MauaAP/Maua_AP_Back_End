import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { JsonInfo, getCertificateHtml } from "../../../../shared/utils/html_certificate";
import { saveCertificate } from "../../../../shared/infra/repositories/certificate_repository_s3";
import { promisify } from "util";
import PuppeteerHTMLPDF from "puppeteer-html-pdf";

export class CreateCertificateUsecase {
  private htmlPdf: any;

  constructor(
    private presenceRepository: IPresenceRepository,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {
    // Instancie o htmlPdf aqui
    this.htmlPdf = new PuppeteerHTMLPDF();
  }

  async execute(presenceId: string) {
    const presence = await this.presenceRepository.getPresenceById(presenceId);

    if (!presence) {
      throw new Error("Presença não encontrada");
    }
    const userId = presence.userId;
    const eventId = presence.eventId;

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
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
      duration: event.duration,
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

    const html = getCertificateHtml(json);

    this.htmlPdf.setOptions({ 
      format: "A4",
      path: "./certificate.pdf",
      landscape: true,
    });
    const stream = this.htmlPdf.create(html);
    const certificatePdf = await promisify(stream.arrayBuffer.bind(stream))();
    const certificateUrl = await saveCertificate(
      userId,
      eventId,
      Buffer.from(certificatePdf)
    );
    return certificateUrl;
  }
}
