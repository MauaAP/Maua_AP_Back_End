export enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  PROFESSOR = "PROFESSOR",
}

export function toEnum(value: string): ROLE {
  switch (value) {
    case "USER":
      return ROLE.USER;
    case "ADMIN":
      return ROLE.ADMIN;
    case "MODERATOR":
      return ROLE.MODERATOR;
    case "PROFESSOR":
      return ROLE.PROFESSOR;
    default:
      throw new Error("Invalid value");
  }
}