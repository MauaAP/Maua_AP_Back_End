import jwt from "jsonwebtoken";
import { EntityError } from "../helpers/errors/domain_errors";

export function getUserFromToken(authorization: string) {
  try {
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new EntityError("Token not provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user: string;
    };
    if (!decoded || !decoded.user) {
      throw new EntityError("Invalid token");
    }

    const user = JSON.parse(decoded.user);
    return user;
  } catch (error) {
    throw new EntityError("Failed to decode token");
  }
}
