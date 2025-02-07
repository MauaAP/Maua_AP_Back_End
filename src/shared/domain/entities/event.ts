import { EntityError } from "../../helpers/errors/domain_errors";
import { MODALITY } from "../enums/modality_type";

export interface EventProps {
  eventId?: string;
  eventName: string;
  date: number;
  host: string;
  manager: string[];
  hostEmail: string[];
  hostPhone: string[];
  local: string;
  modality: MODALITY;
  targetAudience: string;
  activityType: string;
  numberMaxParticipants?: number;
  goals: string;
  period: string
  contentActivities: string[];
  developedCompetencies: string;
  initTime: number;
  finishTime: number;
}

export class Event {
  constructor(public props: EventProps) {
    this.validateProps(props);
  }

  private validateProps(props: EventProps) {
    if (!Event.isValidAtributtes(props.eventName)) {
      throw new EntityError("event name");
    }

    if (!Event.validateTime(props.date)) {
      throw new EntityError("date");
    }

    if (!Event.isValidAtributtes(props.host)) {
      throw new EntityError("host");
    }

    if (!Event.isValidManager(props.manager)) {
      throw new EntityError("manager");
    }

    if (!Event.isValidAtributtes(props.hostEmail)) {
      throw new EntityError("host email");
    }

    if (!Event.isValidAtributtes(props.hostPhone)) {
      throw new EntityError("host phone");
    }

    if (!Event.isValidAtributtes(props.local)) {
      throw new EntityError("local");
    }

    if (!Event.isValidAtributtes(props.modality)) {
      throw new EntityError("modality");
    }

    if (!Event.isValidAtributtes(props.targetAudience)) {
      throw new EntityError("target audience");
    }

    if (!Event.isValidAtributtes(props.activityType)) {
      throw new EntityError("activity type");
    }

    if (
      props.numberMaxParticipants &&
      !Event.isValidNumberMaxParticipants(props.numberMaxParticipants)
    ) {
      throw new EntityError("number max participants");
    }

    if (!Event.isValidAtributtes(props.goals)) {
      throw new EntityError("goals");
    }

    if (!Event.isValidAtributtes(props.period)) {
      throw new EntityError("period");
    }

    if (!Event.isValidAtributtes(props.contentActivities)) {
      throw new EntityError("content activities");
    }

    if (!Event.isValidAtributtes(props.developedCompetencies)) {
      throw new EntityError("developed competencies");
    }

    if (!Event.validateTime(props.initTime)) {
      throw new EntityError("init time");
    }

    if (!Event.validateTime(props.finishTime)) {
      throw new EntityError("finish time");
    }
  }

  get eventId(): string {
    return this.props.eventId || "";
  }

  set eventId(eventId: string) {
    this.props.eventId = eventId;
  }

  get eventName(): string {
    return this.props.eventName;
  }

  get date(): number {
    return this.props.date;
  }

  get host(): string {
    return this.props.host;
  }

  get manager(): string[] {
    return this.props.manager;
  }

  get hostEmail(): string[] {
    return this.props.hostEmail;
  }

  get hostPhone(): string[] {
    return this.props.hostPhone;
  }

  get local(): string {
    return this.props.local;
  }

  get modality(): string {
    return this.props.modality;
  }

  get targetAudience(): string {
    return this.props.targetAudience;
  }

  get activityType(): string {
    return this.props.activityType;
  }

  get maxParticipants(): number | undefined {
    return this.props.numberMaxParticipants;
  }

  get goals(): string {
    return this.props.goals;
  }

  get period(): string {
    return this.props.period;
  }

  get contentActivities(): string[] {
    return this.props.contentActivities;
  }

  get developedCompetencies(): string {
    return this.props.developedCompetencies;
  }

  get initTime(): number {
    return this.props.initTime;
  }

  get finishTime(): number {
    return this.props.finishTime;
  }

  setEventName(eventName: string): void {
    if (!Event.isValidAtributtes(eventName)) {
      throw new EntityError("event name");
    }
    this.props.eventName = eventName;
  }

  setDate(date: number): void {
    if (!Event.validateTime(date)) {
      throw new EntityError("date");
    }
    this.props.date = date;
  }

  setHost(host: string): void {
    if (!Event.isValidHost(host)) {
      throw new EntityError("host");
    }
    this.props.host = host;
  }

  setManager(manager: string[]): void {
    if (!Event.isValidManager(manager)) {
      throw new EntityError("manager");
    }
    this.props.manager = manager;
  }

  setHostEmail(hostEmail: string[]): void {
    if (!Event.isValidAtributtes(hostEmail)) {
      throw new EntityError("host email");
    }
    this.props.hostEmail = hostEmail;
  }

  setHostPhone(hostPhone: string[]): void {
    if (!Event.isValidAtributtes(hostPhone)) {
      throw new EntityError("host phone");
    }
    this.props.hostPhone = hostPhone;
  }

  setLocal(local: string): void {
    if (!Event.isValidAtributtes(local)) {
      throw new EntityError("local");
    }
    this.props.local = local;
  }

  setModality(modality: MODALITY): void {
    if (!Event.isValidAtributtes(modality)) {
      throw new EntityError("modality");
    }
    this.props.modality = modality;
  }

  setTargetAudience(targetAudience: string): void {
    if (!Event.isValidAtributtes(targetAudience)) {
      throw new EntityError("target audience");
    }
    this.props.targetAudience = targetAudience;
  }

  setActivityType(activityType: string): void {
    if (!Event.isValidAtributtes(activityType)) {
      throw new EntityError("activity type");
    }
    this.props.activityType = activityType;
  }

  setMaxParticipants(maxParticipants: number | undefined): void {
    if (
      maxParticipants !== undefined &&
      !Event.isValidNumberMaxParticipants(maxParticipants)
    ) {
      throw new EntityError("Invalid max participants");
    }
    this.props.numberMaxParticipants = maxParticipants;
  }

  setGoals(goals: string): void {
    if (!Event.isValidAtributtes(goals)) {
      throw new EntityError("Invalid goals");
    }
    this.props.goals = goals;
  }

  setPeriod(period: string): void {
    if (!Event.isValidAtributtes(period)) {
      throw new EntityError("Invalid period");
    }
    this.props.period = period;
  }

  setContentActivities(contentActivities: string[]): void {
    if (!Event.isValidAtributtes(contentActivities)) {
      throw new EntityError("Invalid content activities");
    }
    this.props.contentActivities = contentActivities;
  }

  setDevelopedCompetencies(developedCompetencies: string): void {
    if (!Event.isValidAtributtes(developedCompetencies)) {
      throw new EntityError("Invalid developed competencies");
    }
    this.props.developedCompetencies = developedCompetencies;
  }

  setInitTime(initTime: number): void {
    if (!Event.validateTime(initTime)) {
      throw new EntityError("Invalid init time");
    }
    this.props.initTime = initTime;
  }

  setFinishTime(finishTime: number): void {
    if (!Event.validateTime(finishTime)) {
      throw new EntityError("Invalid finish time");
    }
    this.props.finishTime = finishTime;
  }

  static isValidNumberMaxParticipants(numberMaxParticipants?: number): boolean {
    if (
      typeof numberMaxParticipants !== "number" ||
      isNaN(numberMaxParticipants) ||
      numberMaxParticipants === 0
    ) {
      return false;
    }

    return numberMaxParticipants >= 0;
  }

  static isValidAtributtes(atributtes: string | string[]) {
    if (Array.isArray(atributtes)) {
      return atributtes.every((attr) => attr.trim().length > 0);
    } else {
      return atributtes.trim().length > 0;
    }
  }

  static validateTime(time?: number | null): boolean {
    if (typeof time !== "number" || isNaN(time)) {
      return false;
    }

    const minValidTime = new Date("1970-01-01").getTime();
    const maxValidTime = new Date("2100-01-01").getTime();

    return time >= minValidTime && time <= maxValidTime;
  }

  static isValidHost(host: string): boolean {
    return host.trim().length > 0;
  }

  static isValidManager(manager: string[]): boolean {
    return manager.length > 0;
  }

  static isValidModality(modality: MODALITY): boolean {
    return Object.values(MODALITY).includes(modality);
  }
}
