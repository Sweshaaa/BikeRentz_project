import { z } from "zod";

export const createRentalSchema = z
  .object({
    bikeId: z.string().min(1, "bikeId is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const updateRentalStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"]),
});

export type CreateRentalDTO = z.infer<typeof createRentalSchema>;
export type UpdateRentalStatusDTO = z.infer<typeof updateRentalStatusSchema>;
