import RentalOrder, { IRentalOrder } from "../models/RentalOrder";

export class RentalRepository {
  create(data: Partial<IRentalOrder>) {
    return RentalOrder.create(data);
  }

  findById(id: string) {
    return RentalOrder.findById(id).populate("bike").populate("renter", "name email");
  }

  findByRenter(renterId: string) {
    return RentalOrder.find({ renter: renterId }).populate("bike").sort({ createdAt: -1 });
  }

  findAll() {
    return RentalOrder.find().populate("bike").populate("renter", "name email").sort({ createdAt: -1 });
  }

  findOverlapping(bikeId: string, startDate: Date, endDate: Date) {
    return RentalOrder.find({
      bike: bikeId,
      status: { $in: ["PENDING", "CONFIRMED", "ACTIVE"] },
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    });
  }

  update(id: string, data: Partial<IRentalOrder>) {
    return RentalOrder.findByIdAndUpdate(id, data, { new: true });
  }

  findExpiredActive(now: Date) {
    return RentalOrder.find({ status: "ACTIVE", endDate: { $lt: now } });
  }
}
