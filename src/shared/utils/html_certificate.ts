export type JsonInfo = {
    name: string
    manager: string[]
    initTime: string
    finishTime: string
    eventName: string
    date: string
    local: string
    dateNow: string
    monthNow: string
    yearNow: string
}

export function getCertificateHtml(jsonInfo: JsonInfo): string {
    return `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Gentium+Book+Plus:ital,wght@0,400;0,700;1,400;1,700&display=swap');
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
            }
            .fontGentiumBookRegular {
                font-family: "Gentium Book Plus", serif;
                font-weight: 400;
                font-style: normal;
            }
            .container {
                display: flex;
                padding: 3rem;
                justify-content: start;
                align-items: center;
                height: 100vh;
            }
            .containerIcon{
                display: flex;
                height: 100%;
                justify-content: space-between;
                flex-direction: column;
                gap: 1rem;
            }
            .imageIcon {
                width: 100px;
                height: 100px;
            }
            .containerInfo {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            /* ========== HEADER INFO ========== */
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
            /* ========== BODY INFO ========== */
            .bodyInfo {
                padding: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                gap: 4rem;
            }
            .bodyInfo p {
                font-size: 1.5rem;
                text-align: center;
                font-style: italic;
            }
            .bodyInfo h2 {
                font-size: 3rem;
                font-weight: bold;
            }
            /* ========== FOOTER INFO ========== */
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
    <body class="container">
        <section class="containerIcon">
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />
            <img class="imageIcon" src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/logo-maua.jpg" />   
        </section>
        <section class="containerInfo">
            <aside class="headerInfo">
                <h1>Academia de Professores</h1>
                <img src="https://ap-imt.s3.sa-east-1.amazonaws.com/assets/nome-maua.jpg" />
            </aside>
            <aside class="bodyInfo">
                <p class="fontGentiumBookRegular">A Academia de Professores do Centro Universitário do Instituto Mauá de Tecnologia confere a</p>
                <h2>${jsonInfo.name}</h2>
                <p class="fontGentiumBookRegular">o presente Certificado por ter participado do evento ${jsonInfo.eventName}, ministrado por ${jsonInfo.manager}, realizado em ${jsonInfo.date}, das ${jsonInfo.initTime} às ${jsonInfo.finishTime}.</p>
                <p class="fontGentiumBookRegular">São Caetano do Sul, ${jsonInfo.dateNow} de ${jsonInfo.monthNow} de ${jsonInfo.yearNow}.</p>
            </aside>
            <aside class="footerInfo">
                <div class="cardInfo">
                    <label>prof. Dr. Octavio Mattasoglio Neto</label>
                    <label>Presidente da Academia de Professores</label>
                    <label>CEUN-IMT</label>
                </div>
                <div class="cardInfo">
                    <label>Prof. Dr. José Carlos de Souza Junior</label>
                    <label>Reitor</label>
                    <label>CEUN-IMT</label>
                </div>
            </aside>
        </section>
    </body>
    </html>`
}