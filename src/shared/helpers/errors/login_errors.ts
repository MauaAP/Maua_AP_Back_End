import { BaseError } from "./base_error";

export class PasswordDoesNotMatchError extends BaseError {
  constructor() {
    super("Password does not match");
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super("Invalid credentials");
  }
}


