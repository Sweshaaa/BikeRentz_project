import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "../utils/errorResponse";
import { IUserPayload } from "../types/user.type";

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

export function protect(req: Request, _res: Response, next: NextFunction) {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined);

  if (!token) {
    return next(new ErrorResponse("Not authorized, no token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    next(new ErrorResponse("Not authorized, token invalid or expired", 401));
  }
}
