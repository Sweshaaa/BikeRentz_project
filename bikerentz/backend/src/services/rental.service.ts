import { RentalRepository } from "../repositories/rental.repository";
import { BikeRepository } from "../repositories/bike.repository";
import { ErrorResponse } from "../utils/errorResponse";
import { CreateRentalDTO } from "../dtos/rental.dto";
import { KhaltiService } from "./khalti.service";
import { NotificationService } from "./notification.service";
import { sendMail, bookingConfirmationTemplate } from "../utils/mailer";

const rentalRepo = new RentalRepository();
const bikeRepo = new BikeRepository();
const khalti = new KhaltiService();
const notifications = new NotificationService();

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export class RentalService {
  async createBooking(renterId: string, renterName: string, renterEmail: string, payload: CreateRentalDTO) {
    const bike = await bikeRepo.findById(payload.bikeId);
    if (!bike) throw new ErrorResponse("Bike not found", 404);
    if (bike.status !== "AVAILABLE") throw new ErrorResponse("Bike is not available for the selected dates", 409);

    const overlapping = await rentalRepo.findOverlapping(payload.bikeId, payload.startDate, payload.endDate);
    if (overlapping.length > 0) {
      throw new ErrorResponse("Bike is already booked for part of this date range", 409);
    }

    const days = daysBetween(payload.startDate, payload.endDate);
    const totalPrice = days * bike.pricePerDay;

    const order = await rentalRepo.create({
      renter: renterId as unknown as never,
      bike: payload.bikeId as unknown as never,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalPrice,
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    const payment = await khalti.initiate({
      amount: totalPrice,
      purchaseOrderId: order.id,
      purchaseOrderName: `Rental - ${bike.name}`,
      customerName: renterName,
      customerEmail: renterEmail,
      returnUrl: process.env.KHALTI_RETURN_URL as string,
      websiteUrl: process.env.CLIENT_URL as string,
    });

    await rentalRepo.update(order.id, { paymentReference: payment.pidx });

    return { order, paymentUrl: payment.payment_url, pidx: payment.pidx };
  }

  async verifyPayment(pidx: string) {
    const result = await khalti.verify(pidx);
    const order = await (await import("../models/RentalOrder")).default.findOne({ paymentReference: pidx });
    if (!order) throw new ErrorResponse("Order not found for this payment", 404);

    if (result.status === "Completed") {
      order.paymentStatus = "PAID";
      order.status = "CONFIRMED";
      await order.save();
      await bikeRepo.setStatus(order.bike.toString(), "RENTED");

      const bike = await bikeRepo.findById(order.bike.toString());
      const renter = await (await import("../models/User")).default.findById(order.renter);

      if (renter) {
        await notifications.notify(
          renter.id,
          `Your booking for ${bike?.name} is confirmed (${order.startDate.toDateString()} - ${order.endDate.toDateString()}).`,
          "booking"
        );
        await sendMail({
          to: renter.email,
          subject: "BikeRentz Booking Confirmed",
          html: bookingConfirmationTemplate(
            bike?.name || "your bike",
            order.startDate.toDateString(),
            order.endDate.toDateString(),
            order.totalPrice
          ),
        });
      }
    } else {
      order.paymentStatus = "FAILED";
      await order.save();
    }

    return order;
  }

  async myRentals(renterId: string) {
    return rentalRepo.findByRenter(renterId);
  }

  async all() {
    return rentalRepo.findAll();
  }

  async updateStatus(id: string, status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED") {
    const order = await rentalRepo.update(id, { status });
    if (!order) throw new ErrorResponse("Rental order not found", 404);

    if (status === "COMPLETED" || status === "CANCELLED") {
      await bikeRepo.setStatus(order.bike.toString(), "AVAILABLE");
    }
    return order;
  }

  async completeExpiredRentals() {
    const expired = await rentalRepo.findExpiredActive(new Date());
    for (const order of expired) {
      order.status = "COMPLETED";
      await order.save();
      await bikeRepo.setStatus(order.bike.toString(), "AVAILABLE");
    }
    return expired.length;
  }
}
