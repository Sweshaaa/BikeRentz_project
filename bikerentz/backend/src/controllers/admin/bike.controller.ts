import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { ApiResponse } from "../../utils/apiResponse";
import { BikeService } from "../../services/bike.service";
import { createBikeSchema, updateBikeSchema } from "../../dtos/bike.dto";
import { ErrorResponse } from "../../utils/errorResponse";

const bikeService = new BikeService();

export const createBike = asyncHandler(async (req: Request, res: Response) => {
  const payload = createBikeSchema.parse(req.body);
  if (!req.file) throw new ErrorResponse("Bike image is required", 400);
  const image = `/bikes/${req.file.filename}`;
  const bike = await bikeService.create(payload, image, req.user!.id);
  return ApiResponse.success(res, "Bike added to fleet", bike, 201);
});

export const updateBike = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateBikeSchema.parse(req.body);
  const image = req.file ? `/bikes/${req.file.filename}` : undefined;
  const bike = await bikeService.update(req.params.id as string, payload, image);
  return ApiResponse.success(res, "Bike updated", bike);
});

export const deleteBike = asyncHandler(async (req: Request, res: Response) => {
  await bikeService.delete(req.params.id as string);
  return ApiResponse.success(res, "Bike removed from fleet");
});

export const setBikeStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const bike = await bikeService.setStatus(req.params.id as string, status);
  return ApiResponse.success(res, "Bike status updated", bike);
});
