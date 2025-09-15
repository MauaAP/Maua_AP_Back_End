import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { PDFDocument } from "pdf-lib";

export class GenerateSelectedCertificatesUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private createCertificateUsecase: CreateCertificateUsecase
  ) {}

  async execute(userId: string, presenceIds: string[]): Promise<Buffer> {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);
    const validPresences = presences.filter((p: any) =>
      presenceIds.includes(p.presenceId)
    );

    const mergedPdf = await PDFDocument.create();

    for (const presence of validPresences) {
      try {
        const pdfBuffer = await this.createCertificateUsecase.execute(
          presence.presenceId
        );

        const pdf = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error: any) {
        console.error(
          `Error generating certificate for presence ${presence.presenceId}: ${error.message}`
        );
      }
    }

    const finalPdf = await mergedPdf.save();
    return Buffer.from(finalPdf);
  }
}
