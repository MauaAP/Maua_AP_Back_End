import { prisma } from "../../../../../prisma/prisma";

const TREINAMENTO_PRINT_EVENT_IDS = [
  "c9c6bc05-733b-4f74-93e7-5964a1283131",
  "e9f55db1-cb75-4bd1-bb3d-7d04e427db62",
  "5120790e-da15-4c2e-818a-fd39e906b5ca",
  "40182339-f4b9-4b3e-af33-95382655284c",
];

const DIA_SEMANA: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terça",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sábado",
};

export type TreinamentoPrintResponse = {
  eventos: Array<{
    eventId: string;
    nomeEvento: string;
    data: string;
    diaSemana: string;
    professores: string[];
  }>;
  porDia: {
    segunda: string[];
    quinta: string[];
    segunda_e_quinta: string[];
  };
  resumo: {
    totalProfessoresUnicos: number;
    totalPresencas: number;
  };
};

export class GetTreinamentoPrintPresencasUsecase {
  async execute(): Promise<TreinamentoPrintResponse> {
    const presences = await prisma.presence.findMany({
      where: {
        eventId: { in: TREINAMENTO_PRINT_EVENT_IDS },
        user: { role: "PROFESSOR" },
      },
      include: {
        user: { select: { name: true } },
        event: { select: { id: true, eventName: true, date: true } },
      },
    });

    const byUserDays = new Map<string, Set<number>>();
    const userNames = new Map<string, string>();
    for (const p of presences) {
      userNames.set(p.userId, p.user.name);
      const day = new Date(p.event.date).getDay();
      if (!byUserDays.has(p.userId)) byUserDays.set(p.userId, new Set());
      byUserDays.get(p.userId)!.add(day);
    }

    const porDia = {
      segunda: [] as string[],
      quinta: [] as string[],
      segunda_e_quinta: [] as string[],
    };
    for (const [userId, days] of byUserDays) {
      const nome = userNames.get(userId)!;
      const temSegunda = days.has(1);
      const temQuinta = days.has(4);
      if (temSegunda && temQuinta) {
        porDia.segunda_e_quinta.push(nome);
      } else if (temSegunda) {
        porDia.segunda.push(nome);
      } else if (temQuinta) {
        porDia.quinta.push(nome);
      }
    }
    porDia.segunda.sort((a, b) => a.localeCompare(b));
    porDia.quinta.sort((a, b) => a.localeCompare(b));
    porDia.segunda_e_quinta.sort((a, b) => a.localeCompare(b));

    const byEvent = new Map<
      string,
      { eventName: string; date: Date; diaSemana: string; names: Set<string> }
    >();
    for (const p of presences) {
      const eventDate = new Date(p.event.date);
      const day = eventDate.getDay();
      const diaSemana = DIA_SEMANA[day] ?? "—";
      if (!byEvent.has(p.eventId)) {
        byEvent.set(p.eventId, {
          eventName: p.event.eventName,
          date: eventDate,
          diaSemana,
          names: new Set(),
        });
      }
      byEvent.get(p.eventId)!.names.add(p.user.name);
    }

    const eventos = TREINAMENTO_PRINT_EVENT_IDS.map((eventId) => {
      const info = byEvent.get(eventId);
      const professores = info
        ? Array.from(info.names).sort((a, b) => a.localeCompare(b))
        : [];
      const dataStr = info
        ? info.date.toISOString().slice(0, 10)
        : "";
      return {
        eventId,
        nomeEvento: info?.eventName ?? "Evento",
        data: dataStr,
        diaSemana: info?.diaSemana ?? "—",
        professores,
      };
    });

    const totalProfessoresUnicos = byUserDays.size;
    const totalPresencas = presences.length;

    return {
      eventos,
      porDia,
      resumo: { totalProfessoresUnicos, totalPresencas },
    };
  }
}
