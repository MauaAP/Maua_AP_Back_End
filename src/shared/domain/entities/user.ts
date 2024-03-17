import { EntityError } from "../../helpers/errors/domain_errors";
import { ROLE } from "../enums/role_enum";

export interface UserProps {
  name: string;
  email: string;
  role: ROLE;
  password: string;
}

export class User {
  constructor(public props: UserProps) {
    this.validateProps(props);
  }

  private validateProps(props: UserProps) {
    if (!User.isValidEmail(props.email)) {
      throw new EntityError("Invalid email");
    }

    if (!User.isValidName(props.name)) {
      throw new EntityError("Invalid name");
    }

    if (!User.isValidPassword(props.password)) {
      throw new EntityError("Invalid password");
    }
  }


  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): ROLE {
    return this.props.role;
  }

  get password(): string {
    return this.props.password;
  }

  setName(name: string): void {
    if (!User.isValidName(name)) {
      throw new EntityError("Invalid name");
    }
    this.props.name = name;
  }

  setEmail(email: string): void {
    if (!User.isValidEmail(email)) {
      throw new EntityError("Invalid email");
    }
    this.props.email = email;
  }

  setPassword(password: string): void {
    if (!User.isValidPassword(password)) {
      throw new EntityError("Invalid password");
    }
    this.props.password = password;
  }

  setRole(role: ROLE) {
    if (!User.validateRole(role)) {
      throw new EntityError("props.role");
    }
    this.props.role = role;
  }

  static isValidName(name: string): boolean {
    name = name.trim();
    return name.length >= 2 && name.length <= 130;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return (
      typeof password === "string" &&
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()-=_+[\]{};':"\\|,.<>/?]/.test(password) 
    );
  }

  static validateRole(role: ROLE): boolean {
    if (role == null) {
      return false;
    }

    if (Object.values(ROLE).includes(role) == false) {
      return false;
    }
    
    return true;
  }
}
