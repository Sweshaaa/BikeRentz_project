import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async";
import { ApiResponse } from "../utils/apiResponse";
import { UserService } from "../services/user.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../dtos/user.dto";

const userService = new UserService();

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await userService.register(payload);
  setAuthCookies(res, accessToken, refreshToken);
  return ApiResponse.success(res, "Registered successfully", { user, accessToken }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await userService.login(payload);
  setAuthCookies(res, accessToken, refreshToken);
  return ApiResponse.success(res, "Logged in successfully", { user, accessToken });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return ApiResponse.success(res, "Logged out successfully");
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const payload = forgotPasswordSchema.parse(req.body);
  await userService.forgotPassword(payload.email);
  return ApiResponse.success(res, "If that email exists, a reset link has been sent");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const payload = resetPasswordSchema.parse(req.body);
  await userService.resetPassword(payload.token, payload.password);
  return ApiResponse.success(res, "Password reset successfully");
});
