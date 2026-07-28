import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorResponse("Admin access required", 403));
  }
  next();
}
