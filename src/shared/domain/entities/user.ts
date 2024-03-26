import { EntityError } from "../../helpers/errors/domain_errors";
import { ROLE } from "../enums/role_enum";

export interface UserProps {
  name: string;
  email: string;
  role: ROLE;
  password: string;
  telefone?: string;
  cpf?: string;
  registration: string;
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

    if (props.telefone && props.telefone.trim().length === 0) {
      throw new EntityError("Invalid telefone");
    }

    if (props.cpf && props.cpf.trim().length === 0) {
      throw new EntityError("Invalid cpf");
    }

    if (props.cpf && !User.validateCPF(props.cpf)) {
      throw new EntityError("Invalid cpf");
    }

    if (props.telefone && !User.validatePhoneNumber(props.telefone)) {
      throw new EntityError("Invalid telefone");
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

  get telefone(): string | undefined {
    return this.props.telefone;
  }

  get cpf(): string | undefined {
    return this.props.cpf;
  }

  get registration(): string {
    return this.props.registration;
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

  setTelefone(telefone: string): void {
    if (telefone.trim().length === 0) {
      throw new EntityError("Invalid telefone");
    }
    this.props.telefone = telefone;
  }

  setCpf(cpf: string): void {
    if (cpf.trim().length === 0) {
      throw new EntityError("Invalid cpf");
    }
    this.props.cpf = cpf;
  }

  setRegistration(registration: string): void {
    if (!User.validateRegistration(registration)) {
      throw new EntityError("Invalid registration");
    }
    this.props.registration = registration;
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

  static validatePhoneNumber(phoneNumber: string): boolean {
    phoneNumber = phoneNumber.replace(/\D/g, '');
  
    if (phoneNumber.length !== 11) {
      return false;
    }
  
    const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    const ddd = phoneNumber.substring(0, 2);
    if (!validDDDs.includes(ddd)) {
      return false;
    }
  
    return true;
  }
  

  static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit = remainder >= 10 ? 0 : remainder;

    if (digit !== parseInt(cpf.charAt(9))) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    digit = remainder >= 10 ? 0 : remainder;

    if (digit !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  static validateRegistration(registration: string): boolean {
    const registrationRegex = /^\d-\d{5}$/;
    return registrationRegex.test(registration);
  }
}
