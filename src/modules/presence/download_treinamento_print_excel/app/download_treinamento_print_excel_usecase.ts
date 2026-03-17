import * as XLSX from "xlsx";
import { GetTreinamentoPrintPresencasUsecase } from "../../get_treinamento_print_presencas/app/get_treinamento_print_presencas_usecase";

export class DownloadTreinamentoPrintExcelUsecase {
  constructor(private getPresencasUsecase: GetTreinamentoPrintPresencasUsecase) {}

  async execute(): Promise<Buffer> {
    const data = await this.getPresencasUsecase.execute();
    const wb = XLSX.utils.book_new();

    const sheetEventos: (string | number)[][] = [
      ["Evento", "Data", "Dia da semana", "Professor"],
    ];
    for (const ev of data.eventos) {
      for (const nome of ev.professores) {
        sheetEventos.push([ev.nomeEvento, ev.data, ev.diaSemana, nome]);
      }
      if (ev.professores.length === 0) {
        sheetEventos.push([ev.nomeEvento, ev.data, ev.diaSemana, "(nenhum)"]);
      }
    }
    const wsEventos = XLSX.utils.aoa_to_sheet(sheetEventos);
    XLSX.utils.book_append_sheet(wb, wsEventos, "Por evento");

    const sheetPorDia: (string | number)[][] = [
      ["Dia de participação", "Professor"],
    ];
    for (const nome of data.porDia.segunda) {
      sheetPorDia.push(["Apenas segunda", nome]);
    }
    for (const nome of data.porDia.quinta) {
      sheetPorDia.push(["Apenas quinta", nome]);
    }
    for (const nome of data.porDia.segunda_e_quinta) {
      sheetPorDia.push(["Segunda e quinta", nome]);
    }
    const wsPorDia = XLSX.utils.aoa_to_sheet(sheetPorDia);
    XLSX.utils.book_append_sheet(wb, wsPorDia, "Por dia");

    const sheetResumo: (string | number)[][] = [
      ["Resumo - Treinamento Print"],
      [],
      ["Total de professores únicos", data.resumo.totalProfessoresUnicos],
      ["Total de presenças registradas", data.resumo.totalPresencas],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(sheetResumo);
    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return buffer as Buffer;
  }
}
