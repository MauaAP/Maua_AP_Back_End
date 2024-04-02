export enum MODALITY {
    PRESENCIAL = "PRESENCIAL",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
}

export function toEnum(value: string): MODALITY {
    switch (value) {
        case "PRESENCIAL":
            return MODALITY.PRESENCIAL;
        case "REMOTE":
            return MODALITY.REMOTE;
        case "HYBRID":
            return MODALITY.HYBRID;
        default:
            throw new Error("Invalid value");
    }
}
