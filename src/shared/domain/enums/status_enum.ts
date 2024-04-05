export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export function toEnum(value: string): STATUS {
  switch (value) {
    case "ACTIVE":
      return STATUS.ACTIVE;
    case "INACTIVE":
      return STATUS.INACTIVE;
    default:
      throw new Error("Invalid value");
  }
}
