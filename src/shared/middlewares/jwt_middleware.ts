import jwt from "jsonwebtoken";
import { EntityError } from "../helpers/errors/domain_errors";
import { ROLE } from "../domain/enums/role_enum";

type UserFromToken = {
  email: string;
  role: ROLE;
};

export function getUserFromToken(authorization: string) {
  try {
    const token = authorization;
    if (!token) {
      throw new EntityError("Token not provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserFromToken;
    if (!decoded) {
      throw new EntityError("Invalid token");
    }

    const user = decoded;
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
