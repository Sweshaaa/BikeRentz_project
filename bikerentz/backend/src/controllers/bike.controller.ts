import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async";
import { ApiResponse } from "../utils/apiResponse";
import { BikeService } from "../services/bike.service";

const bikeService = new BikeService();

export const listBikes = asyncHandler(async (req: Request, res: Response) => {
  const bikes = await bikeService.list(req.query as Record<string, string>);
  return ApiResponse.success(res, "Bikes fetched", bikes);
});

export const getBike = asyncHandler(async (req: Request, res: Response) => {
  const bike = await bikeService.getById(req.params.id as string);
  return ApiResponse.success(res, "Bike fetched", bike);
});
