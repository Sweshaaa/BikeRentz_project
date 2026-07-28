import { z } from "zod";

export const createBikeSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  type: z.enum(["Motorbike", "Scooter", "Electric Scooter"]),
  category: z.enum(["Sports", "Cruiser", "Commuter", "Adventure/Touring", "Electric", "Other"]),
  pricePerDay: z.coerce.number().positive(),
  engineCC: z.coerce.number().optional(),
  motorPowerWatts: z.coerce.number().optional(),
  description: z.string().optional(),
});

export const updateBikeSchema = createBikeSchema.partial().extend({
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]).optional(),
});

export type CreateBikeDTO = z.infer<typeof createBikeSchema>;
export type UpdateBikeDTO = z.infer<typeof updateBikeSchema>;
