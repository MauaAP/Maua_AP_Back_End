import { Event } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class GetEventByIdUsecase {
    constructor(private eventRepository: IEventRepository) {}
    
    async execute(eventId: string): Promise<Event> {
        try {
        const event = await this.eventRepository.getEventById(eventId);
        return event;
        } catch (error: any) {
        console.error("Erro ao buscar evento por ID:", error);
        throw new Error("Erro ao buscar evento por ID no banco de dados.");
        }
    }
}