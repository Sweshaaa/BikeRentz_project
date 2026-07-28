import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { ApiResponse } from "../../utils/apiResponse";
import Bike from "../../models/Bike";
import RentalOrder from "../../models/RentalOrder";
import User from "../../models/User";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalBikes, availableBikes, rentedBikes, activeRentals, totalUsers, revenueAgg] =
    await Promise.all([
      Bike.countDocuments(),
      Bike.countDocuments({ status: "AVAILABLE" }),
      Bike.countDocuments({ status: "RENTED" }),
      RentalOrder.countDocuments({ status: { $in: ["CONFIRMED", "ACTIVE"] } }),
      User.countDocuments({ role: "user" }),
      RentalOrder.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

  return ApiResponse.success(res, "Dashboard stats fetched", {
    totalBikes,
    availableBikes,
    rentedBikes,
    activeRentals,
    totalUsers,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
});
