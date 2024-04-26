import { EntityError } from "../../helpers/errors/domain_errors";

export interface PresenceProps {
  id?: string;
  eventId: string;
  userId: string;
  date: number;
}

export class Presence {
  constructor(public props: PresenceProps) {
    this.validateProps(props);
  }

  private validateProps(props: PresenceProps) {
    if (!Presence.isValidUUID(props.eventId)) {
      throw new EntityError("Invalid event ID");
    }

    if (!Presence.isValidUUID(props.userId)) {
      throw new EntityError("Invalid user ID");
    }

    if (!Presence.validateTime(props.date)) {
      throw new EntityError("Invalid date");
    }
  }

  get presenceId(): string | undefined {
    return this.props.id;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get date(): number {
    return this.props.date;
  }

  setEventId(eventId: string): void {
    if (!Presence.isValidUUID(eventId)) {
      throw new EntityError("Invalid event ID");
    }
    this.props.eventId = eventId;
  }

  setUserId(userId: string): void {
    if (!Presence.isValidUUID(userId)) {
      throw new EntityError("Invalid user ID");
    }
    this.props.userId = userId;
  }

  setDate(date: number): void {
    if (!Presence.validateTime(date)) {
      throw new EntityError("Invalid date");
    }
    this.props.date = date;
  }

  static isValidUUID(uuid: string): boolean {
    return uuid.trim().length === 36;
  }

  static validateTime(time?: number | null): boolean {
    if (typeof time !== "number" || isNaN(time)) {
      return false;
    }

    const minValidTime = new Date("1970-01-01").getTime();
    const maxValidTime = new Date("2100-01-01").getTime();

    return time >= minValidTime && time <= maxValidTime;
  }
}
