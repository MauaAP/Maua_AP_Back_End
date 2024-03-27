import { Event, EventProps } from "../../../../shared/domain/entities/event";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";

export class CreateEventUsecase {
  constructor(private repo: IEventRepository) {}

  async execute(eventProps: EventProps) {
    if (!eventProps.eventName) {
      throw new Error("Missing event name");
    }
    if (!eventProps.date) {
      throw new Error("Missing date");
    }
    if (!eventProps.host) {
      throw new Error("Missing host");
    }
    if (!eventProps.manager) {
      throw new Error("Missing manager");
    }
    if (!eventProps.duration) {
      throw new Error("Missing duration");
    }
    if (!eventProps.hostEmail) {
      throw new Error("Missing host email");
    }
    if (!eventProps.hostPhone) {
      throw new Error("Missing host phone");
    }
    if (!eventProps.local) {
      throw new Error("Missing local");
    }
    if (!eventProps.modality) {
      throw new Error("Missing modality");
    }
    if (!eventProps.targetAudience) {
      throw new Error("Missing target audience");
    }
    if (!eventProps.activityType) {
      throw new Error("Missing activity type");
    }
    if (!eventProps.goals) {
      throw new Error("Missing goals");
    }
    if (!eventProps.contentActivities) {
      throw new Error("Missing content activities");
    }
    if (!eventProps.developedCompetencies) {
      throw new Error("Missing developed competencies");
    }
    if (!eventProps.initTime) {
      throw new Error("Missing init time");
    }
    if (!eventProps.finishTime) {
      throw new Error("Missing finish time");
    }

    const newEvent = await this.repo.createEvent(new Event(eventProps));
    return newEvent;
  }
}
