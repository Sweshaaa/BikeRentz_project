import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { ApiResponse } from "../../utils/apiResponse";
import { RentalService } from "../../services/rental.service";
import { updateRentalStatusSchema } from "../../dtos/rental.dto";

const rentalService = new RentalService();

export const listAllRentals = asyncHandler(async (_req: Request, res: Response) => {
  const rentals = await rentalService.all();
  return ApiResponse.success(res, "All rentals fetched", rentals);
});

export const updateRentalStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = updateRentalStatusSchema.parse(req.body);
  const order = await rentalService.updateStatus(req.params.id as string, status);
  return ApiResponse.success(res, "Rental status updated", order);
});
