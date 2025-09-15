import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { CreateCertificateUsecase } from "../../create_certificate/app/create_certificate_usecase";
import { PDFDocument } from "pdf-lib";

export class GenerateAllCertificatesUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private createCertificateUsecase: CreateCertificateUsecase
  ) {}

  async execute(userId: string): Promise<Buffer> {
    const presences = await this.presenceRepository.getAllPresencesByUserId(userId);

    const mergedPdf = await PDFDocument.create();

    for (const presence of presences) {
      try {
        const pdfBuffer = await this.createCertificateUsecase.execute(presence.presenceId);

        const pdf = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => mergedPdf.addPage(page));
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
