import { Event, EventProps } from "../../../../shared/domain/entities/event";
import { User } from "../../../../shared/domain/entities/user";
import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import { EntityError } from "../../../../shared/helpers/errors/domain_errors";

export class CreateEventUsecase {
  constructor(private repo: IEventRepository) {}

  async execute(eventProps: EventProps) {
    if (!Event.isValidAtributtes(eventProps.eventName)) {
      throw new EntityError("event name");
    }
    if (!Event.validateTime(eventProps.date)) {
      throw new EntityError("date");
    }
    if (!Event.isValidHost(eventProps.host)) {
      throw new EntityError("host");
    }
    if (!Event.isValidManager(eventProps.manager)) {
      throw new EntityError("manager");
    }
    for (const email of eventProps.hostEmail) {
      if (!User.isValidEmail(email)) {
        throw new EntityError("host email");
      }
    }
    for (const phone of eventProps.hostPhone) {
      if (!User.validatePhoneNumber(phone)) {
        throw new EntityError("host phone");
      }
    }
    if (!Event.isValidAtributtes(eventProps.local)) {
      throw new EntityError("local");
    }
    if (!Event.isValidModality(eventProps.modality)) {
      throw new EntityError("modality");
    }
    if (!Event.isValidAtributtes(eventProps.targetAudience)) {
      throw new EntityError("target audience");
    }
    if (!Event.isValidAtributtes(eventProps.activityType)) {
      throw new EntityError("activity type");
    }
    if (!Event.isValidAtributtes(eventProps.goals)) {
      throw new EntityError("goals");
    }
    if (!Event.isValidAtributtes(eventProps.period)) {
      throw new EntityError("period");
    }
    if (!Event.isValidAtributtes(eventProps.contentActivities)) {
      throw new EntityError("content activities");
    }
    if (!Event.isValidAtributtes(eventProps.developedCompetencies)) {
      throw new EntityError("developed competencies");
    }
    if (!Event.validateTime(eventProps.initTime)) {
      throw new EntityError("init time");
    }
    if (!Event.validateTime(eventProps.finishTime)) {
      throw new EntityError("finish time");
    }

    const newEvent = await this.repo.createEvent(new Event(eventProps));
    return newEvent;
  }
}
