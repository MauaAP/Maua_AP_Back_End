import { ExternalPresence } from "@prisma/client";

export class CreateExternalPresenceViewModel {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
