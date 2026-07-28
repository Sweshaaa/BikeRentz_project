import mongoose, { Schema, Document } from "mongoose";
import { RentalStatus, PaymentStatus } from "../types/rental.type";

export interface IRentalOrder extends Document {
  renter: mongoose.Types.ObjectId;
  bike: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RentalOrderSchema = new Schema<IRentalOrder>(
  {
    renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED", "FAILED"],
      default: "UNPAID",
    },
    paymentReference: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRentalOrder>("RentalOrder", RentalOrderSchema);
