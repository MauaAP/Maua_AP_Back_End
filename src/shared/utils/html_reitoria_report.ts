export type ReitoriaReportInfo = {
    totalEvents: number;
    activities: {
      event: string;
      professors: number;
      technicalStaff: number;
      collaborators: number;
      students: number;
      total: number;
    }[];
    grandTotal: {
      professors: number;
      technicalStaff: number;
      collaborators: number;
      students: number;
      total: number;
    };
  };
  
  export function getReitoriaReportHtml(reportInfo: ReitoriaReportInfo): string {
    const formattedActivities = reportInfo.activities.map((activity) => `
      <tr>
          <td style="border: 1px solid black;">${activity.event}</td>
          <td style="border: 1px solid black;">${activity.professors}</td>
          <td style="border: 1px solid black;">${activity.technicalStaff}</td>
          <td style="border: 1px solid black;">${activity.collaborators}</td>
          <td style="border: 1px solid black;">${activity.students}</td>
          <td style="border: 1px solid black;">${activity.total}</td>
      </tr>
    `).join('');
  
    return `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap" rel="stylesheet">
        <title>Relatório Reitoria AP</title>
    </head>
    <body style="font-family: 'Roboto', sans-serif; display: flex; justify-content: center;">
        <main style="padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80%;">
            <h2 style="text-transform: uppercase; border-bottom: 2px solid black; width: 50%; text-align: center;">XV - Academia dos Professores - AP</h2>
            <section style="width: 60%;">
                <p>Quadro 1 – Atividades oferecidas pela AP ao longo de 2023</p>
                <table style="text-align: center; width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid black;">Atividades</th>
                            <th style="border: 1px solid black;">Professores</th>
                            <th style="border: 1px solid black;">Corpo Técnico</th>
                            <th style="border: 1px solid black;">Colaboradores</th>
                            <th style="border: 1px solid black;">Alunos</th>
                            <th style="border: 1px solid black;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formattedActivities}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="border: 1px solid black; font-weight: bold;">Total</td>
                            <td style="border: 1px solid black;">${reportInfo.grandTotal.professors}</td>
                            <td style="border: 1px solid black;">${reportInfo.grandTotal.technicalStaff}</td>
                            <td style="border: 1px solid black;">${reportInfo.grandTotal.collaborators}</td>
                            <td style="border: 1px solid black;">${reportInfo.grandTotal.students}</td>
                            <td style="border: 1px solid black;">${reportInfo.grandTotal.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </main>
    </body>
    </html>`;
  }
  