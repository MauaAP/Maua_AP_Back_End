import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { User } from "../../../../shared/domain/entities/user";
import * as Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";

export interface UsersFromPdfResult {
  name: string;
  users: User[];
}

export class GetUsersFromPdfUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(fileBuffer: Buffer): Promise<UsersFromPdfResult[]> {
    const results: UsersFromPdfResult[] = [];
    const processedNames = new Set<string>();

    // 1. tenta extrair texto embutido
    const parsed = await pdfParse(fileBuffer);
    let text = parsed.text.trim();

    // 2. se não tiver texto, cai para OCR
    if (!text || text.length < 10) {
      console.log("⚠️ Nenhum texto embutido, usando OCR...");
      const result = await Tesseract.recognize(fileBuffer, "por", {
        logger: m => console.log(m),
      });
      text = result.data.text;
    }

    // 3. Normalização e split
    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 2);

    // stoplist para remover ruídos do cabeçalho/rodapé
    const stopwords = ["INSTITUTO", "NOME", "ASSINATURA", "PRESENÇA"];

    // regex para nomes com pelo menos duas palavras
    const nameRegex = /^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/;

    function normalizeName(line: string): string {
      return line
        .toLowerCase()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    for (const raw of lines) {
      if (stopwords.some(sw => raw.toUpperCase().includes(sw))) continue;

      const line = normalizeName(raw);
      if (!nameRegex.test(line)) continue;

      if (processedNames.has(line)) continue;
      processedNames.add(line);

      console.log("✅ Nome detectado:", line);

      try {
        const users = await this.userRepository.getUsersByName(line);
        if (users && users.length > 0) {
          results.push({ name: line, users });
        }
      } catch {
        continue;
      }
    }

    return results;
  }
}
