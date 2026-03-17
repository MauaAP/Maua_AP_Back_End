export class PresencesFromEventDTO {
  presenceId: string;
  userId: string;
  eventId: string;
  date: number;
  eventName: string;
  userName: string;
  userEmail: string;

  constructor(
    presenceId: string,
    userId: string,
    eventId: string,
    date: number,
    eventName: string,
    userName: string,
    userEmail: string = ""
  ) {
    this.presenceId = presenceId;
    this.userId = userId;
    this.eventId = eventId;
    this.date = date;
    this.eventName = eventName;
    this.userName = userName;
    this.userEmail = userEmail;
  }

  toJSON() {
    return {
      presenceId: this.presenceId,
      userId: this.userId,
      eventId: this.eventId,
      date: this.date,
      eventName: this.eventName,
      userName: this.userName,
      userEmail: this.userEmail,
    };
  }
}
