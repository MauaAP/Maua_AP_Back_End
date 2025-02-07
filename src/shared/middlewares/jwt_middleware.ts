import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Unauthorized, InternalServerError } from "../helpers/http/http_codes";

export type UserFromToken = {
  id: string;
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
};

declare module "express" {
  interface Request {
    user?: UserFromToken;
  }
}

export function authenticateToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Received token:", token);

  if (!token) {
    console.log("Token not provided");
    return new Unauthorized("Token not provided").send(res);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserFromToken;

    if (!decoded) {
      console.log("Token verification failed");
      return new Unauthorized("Invalid token").send(res);
    }

    console.log("User from token:", decoded);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log("Error decoding token:", error);

    if (error.name === "JsonWebTokenError") {
      return new Unauthorized("Invalid token").send(res);
    } else if (error.name === "TokenExpiredError") {
      return new Unauthorized("Invalid token: expired").send(res);
    } else if (error.name === "NotBeforeError") {
      return new Unauthorized("Invalid token: not active yet").send(res);
    }

    return new InternalServerError("Internal Server Error").send(res);
  }
}
