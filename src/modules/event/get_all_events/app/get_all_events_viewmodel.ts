import { Event } from "../../../../shared/domain/entities/event";

export class GetAllEventsViewmodel {
  eventName: string;
  date: number;
  host: string;
  manager: string[];
  duration: string;
  hostEmail: string[];
  hostPhone: string[];
  local: string;
  modality: string;
  targetAudience: string;
  activityType: string;
  goals: string;
  contentActivities: string[];
  developedCompetencies: string;
  initTime: number;
  finishTime: number;

  constructor(event: Event) {
    this.eventName = event.eventName;
    this.date = event.date;
    this.host = event.host;
    this.manager = event.manager;
    this.duration = event.duration;
    this.hostEmail = event.hostEmail;
    this.hostPhone = event.hostPhone;
    this.local = event.local;
    this.modality = event.modality;
    this.targetAudience = event.targetAudience;
    this.activityType = event.activityType;
    this.goals = event.goals;
    this.contentActivities = event.contentActivities;
    this.developedCompetencies = event.developedCompetencies;
    this.initTime = event.initTime;
    this.finishTime = event.finishTime;
  }
}
