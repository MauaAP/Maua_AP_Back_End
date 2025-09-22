import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

export class OcrUsersFromPdfUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(pdfBuffer: Buffer) {
    // 1. Extrair imagens das páginas do PDF
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    const numPages = pdf.numPages;
    const nomesExtraidos: string[] = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const ops = await page.getOperatorList();
      // Aqui, idealmente, renderizaria a página em canvas e extrairia imagem
      // Para simplificação, vamos assumir que temos uma função que faz isso
      // const imageBuffer = await renderPageToImage(page);
      // const { data: { text } } = await Tesseract.recognize(imageBuffer, "por");
      // nomesExtraidos.push(...extrairNomesDoTexto(text));
    }
    // MOCK: nomes extraídos
    // nomesExtraidos = ["Roberto M", "Maria S"];

    // 2. Buscar usuários para cada nome
    const resultado: Record<string, any[]> = {};
    for (const nome of nomesExtraidos) {
      const users = await this.userRepository.getUsersByName(nome);
      resultado[nome] = users.map(u => ({
        id: u.userId,
        name: u.name,
        email: u.email,
        role: u.role,
        telefone: u.telefone,
        cpf: u.cpf,
        status: u.status,
      }));
    }
    return resultado;
  }
}
