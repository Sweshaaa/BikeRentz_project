import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { ApiResponse } from "../../utils/apiResponse";
import { UserRepository } from "../../repositories/user.repository";
import { ErrorResponse } from "../../utils/errorResponse";
import { updateUserRoleSchema } from "../../dtos/user.dto";

const userRepo = new UserRepository();

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userRepo.findAll();
  return ApiResponse.success(res, "Users fetched", users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userRepo.findById(req.params.id as string);
  if (!user) throw new ErrorResponse("User not found", 404);
  return ApiResponse.success(res, "User fetched", user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userRepo.update(req.params.id as string, req.body);
  if (!user) throw new ErrorResponse("User not found", 404);
  return ApiResponse.success(res, "User updated", user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userRepo.delete(req.params.id as string);
  if (!user) throw new ErrorResponse("User not found", 404);
  return ApiResponse.success(res, "User deleted");
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = updateUserRoleSchema.parse(req.body);
  const targetId = req.params.id as string;

  if (targetId === req.user!.id && role === "user") {
    throw new ErrorResponse("You cannot remove your own admin access", 400);
  }

  const user = await userRepo.update(targetId, { role });
  if (!user) throw new ErrorResponse("User not found", 404);
  return ApiResponse.success(res, "User role updated", user);
});
