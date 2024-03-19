import { Request, Response, NextFunction } from "express";
import { EntityError } from "../helpers/errors/domain_errors";
import { getUserFromToken } from "./jwt_middleware";

export function authenticateAdminToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  console.log("Received token:", token); 

  if (!token) {
    console.log("Token not provided");
    return res.sendStatus(401);
  }

  try {
    const user = getUserFromToken(token); 
    console.log("User from token:", user); 

    if (user.role !== "ADMIN") {
      console.log("User is not an admin");
      return res.sendStatus(403); 
    }

    next();
  } catch (error) {
    console.log("Error decoding token:", error); 
    if (error instanceof EntityError) {
      return res.sendStatus(403); 
    }
    return res.sendStatus(500);
  }
}
