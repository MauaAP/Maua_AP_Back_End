// ====================== TYPES & HELPERS ======================
export type JsonInfo = {
  name: string;
  manager: string[];
  initTime: string;
  finishTime: string;
  eventName: string;
  date: string;
  local: string;
  dateNow: string;
  monthNow: string;
  yearNow: string;
  developedCompetencies?: string; // NOVO: competências separadas por vírgula
};

function formatMonth(month: string): string {
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  return months[parseInt(month) - 1];
}

function formatTime(time: string): string {
  let [hours, minutes] = time.split(":");
  hours = hours.padStart(2, "0");
  minutes = (minutes || "00").padStart(2, "0");
  return minutes === "00" ? `${hours}h` : `${hours}h${minutes}`;
}

// ====================== HTML CERTIFICATE (FRENTE) ======================
export function getCertificateHtml(jsonInfo: JsonInfo): string {
  const [day, month, year] = jsonInfo.date.split("/");
  const formattedDate = `${day} de ${formatMonth(month)} de ${year}`;

  const isBeforeOctober =
    parseInt(year) < 2024 ||
    (parseInt(year) === 2024 &&
      (parseInt(month) < 10 || (parseInt(month) === 9 && parseInt(day) <= 30)));

  return `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
      <meta charset="UTF-8">
      <title>Certificado</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Gentium+Book+Plus:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
          @page { size: A4 landscape; margin: 2cm; }
          .container {
              display: flex;
              padding: 3rem;
              justify-content: start;
              align-items: center;
              width: 29.7cm;   /* largura A4 landscape */
              height: 21cm;    /* altura A4 landscape */
          }
          .containerIcon{
              display: flex;
              height: 100%;
              justify-content: space-between;
              flex-direction: column;
              gap: 1rem;
          }
          .imageIcon { width: 100px; height: 100px; }
          .containerInfo {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
          }
          .headerInfo {
              display: flex;
              align-items: center;
          }
          .headerInfo h1 {
              width: 100%;
              text-align: center;
              font-size: 2.5rem;
              font-weight: bold;
              font-style: italic;
              color: #00A7FF;
          }
          .bodyInfo {
              padding: 2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 3rem;
          }
          .bodyInfo p {
              font-size: 1.5rem;
              text-align: center;
              font-style: italic;
          }
          .bodyInfo h2 { font-size: 3rem; font-weight: bold; }
          .footerInfo {
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 100%;
          }
          .cardInfo {
              display: flex;
              flex-direction: column;
              align-items: center;
          }
      </style>
  </head>
  <body>
      <section class="container">
          <section class="containerIcon">
              ${Array(6).fill(`<img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />`).join("")}
          </section>
          <section class="containerInfo">
              <aside class="headerInfo">
                  <h1>Academia de Professores</h1>
                  <img src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/nome-maua.jpg" />
              </aside>
              <aside class="bodyInfo">
                  <p>A Academia de Professores do Centro Universitário do Instituto Mauá de Tecnologia confere a</p>
                  <h2>${jsonInfo.name}</h2>
                  <p>o presente Certificado por ter participado do evento ${jsonInfo.eventName}, ministrado por ${jsonInfo.manager.join(", ")}, realizado em ${formattedDate}, das ${formatTime(jsonInfo.initTime)} às ${formatTime(jsonInfo.finishTime)}.</p>
                  <p>São Caetano do Sul, ${jsonInfo.dateNow} de ${formatMonth(jsonInfo.monthNow)} de ${jsonInfo.yearNow}.</p>
              </aside>
              <aside class="footerInfo">
                  <div class="cardInfo">
                      <label>Prof. Dr. Octavio Mattasoglio Neto</label>
                      <label>Presidente da Academia de Professores</label>
                      <label>CEUN-IMT</label>
                  </div>
                  <div class="cardInfo">
                      ${isBeforeOctober ? `
                      <label>Prof. Dr. José Carlos de Souza Junior</label>
                      <label>Reitor</label>
                      <label>CEUN-IMT</label>` : `
                      <label>Prof. Dr. Marcello Nitz</label>
                      <label>Reitor</label>
                      <label>CEUN-IMT</label>`}
                  </div>
              </aside>
          </section>
      </section>
  </body>
  </html>`;
}

// ====================== HTML CERTIFICATE (VERSO) ======================
export function getCertificateBackHtml(jsonInfo: JsonInfo): string {
  const competencies = jsonInfo.developedCompetencies
    ? jsonInfo.developedCompetencies.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  return `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>Certificado - Verso</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
      @page { size: A4 landscape; margin: 2cm; }
      .container {
        display: flex;
        padding: 3rem;
        justify-content: start;
        align-items: center;
        width: 29.7cm;
        height: 21cm;
      }
      .containerIcon {
        display: flex;
        height: 100%;
        justify-content: space-between;
        flex-direction: column;
        gap: 1rem;
      }
      .imageIcon { width: 100px; height: 100px; }
      .content {
        width: 100%;
        text-align: center;
        padding: 2rem;
      }
      h2 { font-size: 2rem; margin-bottom: 1rem; }
      ul { list-style: disc; margin: 0 auto; display: inline-block; text-align: left; }
      li { font-size: 1.2rem; margin-bottom: 0.5rem; }
    </style>
  </head>
  <body>
    <section class="container">
      <section class="containerIcon">
        ${Array(6).fill(`<img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />`).join("")}
      </section>
      <section class="content">
        <h2>Competências Desenvolvidas</h2>
        <ul>
          ${competencies.map((c) => `<li>${c}</li>`).join("")}
        </ul>
      </section>
    </section>
  </body>
  </html>`;
}
