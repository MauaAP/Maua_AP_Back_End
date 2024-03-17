export enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export function toEnum(value: string): ROLE {
  switch (value) {
    case "USER":
      return ROLE.USER;
    case "ADMIN":
      return ROLE.ADMIN;
    default:
      throw new Error("Invalid value");
  }
}