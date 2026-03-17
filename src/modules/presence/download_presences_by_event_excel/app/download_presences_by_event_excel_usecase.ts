import * as XLSX from "xlsx";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IExternalPresenceRepository } from "../../../../shared/domain/repositories/external_presence_interface";

interface PresenceRow {
  nome: string;
  email: string;
  data: string;
  horario: string;
  tipo: string;
}

export class DownloadPresencesByEventExcelUsecase {
  constructor(
    private presenceRepository: IPresenceRepository,
    private externalPresenceRepository: IExternalPresenceRepository
  ) {}

  async execute(eventId: string): Promise<Buffer> {
    const [internalPresences, externalPresences] = await Promise.all([
      this.presenceRepository.getAllPresencesByEventId(eventId).catch(() => []),
      this.externalPresenceRepository.getAllExternalPresencesByEventId(eventId).catch(() => []),
    ]);

    const rows: PresenceRow[] = [];

    for (const p of internalPresences) {
      const dateObj = new Date(p.date);
      rows.push({
        nome: p.userName,
        email: p.userEmail,
        data: dateObj.toLocaleDateString("pt-BR"),
        horario: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        tipo: "Interno",
      });
    }

    for (const ep of externalPresences) {
      const dateObj = new Date(ep.date);
      rows.push({
        nome: ep.name,
        email: ep.email,
        data: dateObj.toLocaleDateString("pt-BR"),
        horario: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        tipo: "Externo",
      });
    }

    rows.sort((a, b) => a.nome.localeCompare(b.nome));

    const sheetData: (string | number)[][] = [
      ["Nome", "E-mail", "Data", "Horário", "Tipo"],
      ...rows.map((r) => [r.nome, r.email, r.data, r.horario, r.tipo]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Presenças");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return buffer as Buffer;
  }
}
