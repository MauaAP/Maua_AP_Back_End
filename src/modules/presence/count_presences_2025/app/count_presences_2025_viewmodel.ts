import { CountPresences2025Result } from "./count_presences_2025_usecase";

export interface EventPresenceCountItem {
  eventName: string;
  date: string;
  totalPresences: number;
}

export class CountPresences2025Viewmodel {
  events: EventPresenceCountItem[];

  constructor(result: CountPresences2025Result) {
    this.events = result.events;
  }
}
