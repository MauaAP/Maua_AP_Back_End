export type ProfessorReportInfo = {
    professorName: string;
    activities: {
        date: string;
        time: string;
        duration: string;
        event: string;
    }[];
    instructorActivities: {
        date: string;
        time: string;
        duration: string;
        event: string;
    }[];
    totalActivities: number;
    totalInstructorActivities: number;
    dateNow: string;
    monthNow: string;
    yearNow: string;
};

function formatMonth(month: string): string {
    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    return months[parseInt(month) - 1];
}

function formatTime(hours: number, minutes: number): string {
    return minutes === 0 ? `${hours}h` : `${hours}h${minutes}`;
}

function formatDuration(startTime: Date, endTime: Date): string {
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    let totalHours = endHours - startHours;
    let totalMinutes = endMinutes - startMinutes;

    // Se os minutos finais forem menores que os minutos iniciais, precisamos ajustar a hora
    if (totalMinutes < 0) {
        totalMinutes += 60;
        totalHours -= 1;
    }

    if (totalHours > 0 && totalMinutes > 0) {
        return `${totalHours}h ${totalMinutes}min`;
    } else if (totalHours > 0) {
        return `${totalHours}h`;
    } else {
        return `${totalMinutes}min`;
    }
}

export function getProfessorReportHtml(reportInfo: ProfessorReportInfo): string {
    const formattedActivities = reportInfo.activities.map(activity => `
        <tr>
            <td style="border: 1px solid black;">${activity.date}</td>
            <td style="border: 1px solid black;">${activity.time}</td>
            <td style="border: 1px solid black;">${activity.duration}</td>
            <td style="border: 1px solid black; padding: 4px; width: 50%;">${activity.event}</td>
        </tr>
    `).join('');

    const formattedInstructorActivities = reportInfo.instructorActivities.map(activity => `
        <tr>
            <td style="border: 1px solid black;">${activity.date}</td>
            <td style="border: 1px solid black;">${activity.time}</td>
            <td style="border: 1px solid black;">${activity.duration}</td>
            <td style="border: 1px solid black; padding: 4px; width: 50%;">${activity.event}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Atividades do Professor</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-transform: uppercase; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
        </style>
    </head>
    <body>
        <h2>RELATÓRIO DE ATIVIDADES DA ACADEMIA DE PROFESSORES</h2>
        <h3>Nome: ${reportInfo.professorName}</h3>
        <h3>Atividades nas quais participou</h3>
        <table>
            <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Duração</th>
                <th>Evento</th>
            </tr>
            ${formattedActivities}
        </table>
        <p>Total de atividades nas quais participou: ${reportInfo.totalActivities}</p>
        <h3>Atividades em que atuou como palestrante/instrutor</h3>
        <table>
            <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Duração</th>
                <th>Evento</th>
            </tr>
            ${formattedInstructorActivities}
        </table>
        <p>Total de atividades como palestrante/instrutor: ${reportInfo.totalInstructorActivities}</p>
        <p>São Caetano do Sul, ${reportInfo.dateNow} de ${formatMonth(reportInfo.monthNow)} de ${reportInfo.yearNow}.</p>
    </body>
    </html>`;
}
