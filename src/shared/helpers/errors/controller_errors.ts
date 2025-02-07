import { BaseError } from "./base_error";

export class InvalidRequest extends BaseError {
  constructor(parameter?: string) {
      if (parameter) {
          super(parameter + " not found");
      } else {
          super("No request found");
      }
  }
}

export class InvalidParameter extends BaseError {
  constructor(parameter: string, value: string) {
      super(`Invalid parameter: ${parameter}: ${value}`);
  }
}

export class MissingParameters extends BaseError {
  constructor(message: string) {
    super(`Field ${message} is missing`);
  }
}

export class WrongTypeParameters extends BaseError {
  constructor(
    fieldName: string,
    fieldTypeExpected: string,
    fieldTypeReceived: string
  ) {
    super(
      `Field ${fieldName} isn't in the right type.\n Received: ${fieldTypeReceived}.\n Expected: ${fieldTypeExpected}.`
    );
  }
}
