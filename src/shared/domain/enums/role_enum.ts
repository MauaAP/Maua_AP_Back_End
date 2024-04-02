export enum ROLE {
  ADMIN = "ADMIN",
  SECRETARY = "SECRETARY",
  MODERATOR = "MODERATOR",
  PROFESSOR = "PROFESSOR",
}

export function toEnum(value: string): ROLE {
  switch (value) {
    case "ADMIN":
      return ROLE.ADMIN;
    case "SECRETARY":
      return ROLE.SECRETARY;
    case "MODERATOR":
      return ROLE.MODERATOR;
    case "PROFESSOR":
      return ROLE.PROFESSOR;
    default:
      throw new Error("Invalid value");
  }
}
