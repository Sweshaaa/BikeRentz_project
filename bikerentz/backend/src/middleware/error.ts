import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../utils/errorResponse";
import { ApiResponse } from "../utils/apiResponse";

export function errorHandler(
  err: ErrorResponse | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => issue.message).join(", ");
    return ApiResponse.error(res, message, 400);
  }

  const statusCode = err instanceof ErrorResponse ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  return ApiResponse.error(res, message, statusCode);
}
