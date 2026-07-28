import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async";
import { ApiResponse } from "../utils/apiResponse";
import { UserService } from "../services/user.service";
import { updateProfileSchema } from "../dtos/user.dto";

const userService = new UserService();

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user!.id);
  return ApiResponse.success(res, "Profile fetched", user);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateProfileSchema.parse(req.body);
  if (req.file) {
    payload.avatar = `/avatars/${req.file.filename}`;
  }
  const user = await userService.updateProfile(req.user!.id, payload);
  return ApiResponse.success(res, "Profile updated", user);
});
