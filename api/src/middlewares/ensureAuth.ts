import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { AppError } from "../utils/appError";
import { Role } from "@prisma/client";

interface JwtPayload {
  sub: string;
  role: Role;
}

export const ensureAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Missing auth token", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role
    };

    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
};
