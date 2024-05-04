import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { IPresenceRepository } from "../../../../shared/domain/repositories/presence_repository_interface";
import { IUserRepository } from "../../../../shared/domain/repositories/user_repository_interface";
import { JsonInfo, getCertificateHtml } from "../../../../shared/utils/html_certificate"

const PuppeteerHTMLPDF = require("puppeteer-html-pdf");

export class CreateCertificateUsecase {
    constructor(
        private presenceRepository: IPresenceRepository,
        private eventRepository: IEventRepository,
        private userRepository: IUserRepository
    ) {}

    async execute(presenceId: string) {
        const presence = await this.presenceRepository.getPresenceById(presenceId)
        
        if(!presence){
            throw new Error("Presença não encontrada")
        }
        const userId = presence.userId
        const eventId = presence.eventId
        
        const user = await this.userRepository.getUserById(userId)

        if(!user){
            throw new Error("Usuário não encontrado")
        }

        const event = await this.eventRepository.getEventById(eventId)
        if(!event){
            throw new Error("Evento não encontrado")
        }

        const eventDate = new Date(event.date).getDate() + "/" + (new Date(event.date).getMonth() + 1) + "/" + new Date(event.date).getFullYear()
        const json: JsonInfo = {
            name: user.name,
            manager: event.manager,
            eventName: event.eventName,
            duration: event.duration,
            date: eventDate,
            local: event.local,
            dateNow: new Date().getDate().toString(),
            monthNow: (new Date().getMonth() + 1).toString(),
            yearNow: new Date().getFullYear().toString(),
            initTime: new Date(event.initTime).getHours().toString() + ":" + new Date(event.initTime).getMinutes().toString(),
            finishTime: new Date(event.finishTime).getHours().toString() + ":" + new Date(event.finishTime).getMinutes().toString()
        }

        const html = getCertificateHtml(json)
        // console.log("html: ", html)

        const htmlPdf = new PuppeteerHTMLPDF()

        htmlPdf.setOptions({ format: 'A4', path: './certificate.pdf', landscape: true})
        htmlPdf.create(html)
    }
}