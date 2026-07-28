import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async";
import { ApiResponse } from "../utils/apiResponse";
import { RentalService } from "../services/rental.service";
import { createRentalSchema } from "../dtos/rental.dto";
import { UserService } from "../services/user.service";

const rentalService = new RentalService();
const userService = new UserService();

export const createRental = asyncHandler(async (req: Request, res: Response) => {
  const payload = createRentalSchema.parse(req.body);
  const user = await userService.getProfile(req.user!.id);
  const result = await rentalService.createBooking(req.user!.id, user.name, user.email, payload);
  return ApiResponse.success(res, "Booking initiated, redirect to payment", result, 201);
});

export const verifyRentalPayment = asyncHandler(async (req: Request, res: Response) => {
  const { pidx } = req.query as { pidx: string };
  const order = await rentalService.verifyPayment(pidx);
  return ApiResponse.success(res, "Payment verified", order);
});

export const myRentals = asyncHandler(async (req: Request, res: Response) => {
  const rentals = await rentalService.myRentals(req.user!.id);
  return ApiResponse.success(res, "Your rentals fetched", rentals);
});
