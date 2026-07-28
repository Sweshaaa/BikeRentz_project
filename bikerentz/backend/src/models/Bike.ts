import mongoose, { Schema, Document } from "mongoose";
import { BikeType, BikeCategory, BikeStatus } from "../types/bike.type";

export interface IBike extends Document {
  name: string;
  brand: string;
  type: BikeType;
  category: BikeCategory;
  pricePerDay: number;
  engineCC?: number;
  motorPowerWatts?: number;
  description?: string;
  image: string;
  status: BikeStatus;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BikeSchema = new Schema<IBike>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Motorbike", "Scooter", "Electric Scooter"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Sports", "Cruiser", "Commuter", "Adventure/Touring", "Electric", "Other"],
      default: "Other",
    },
    pricePerDay: { type: Number, required: true, min: 0 },
    engineCC: { type: Number, min: 0 },
    motorPowerWatts: { type: Number, min: 0 },
    description: { type: String, trim: true, default: "" },
    image: { type: String, required: true },
    status: { type: String, enum: ["AVAILABLE", "RENTED", "MAINTENANCE"], default: "AVAILABLE" },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBike>("Bike", BikeSchema);
