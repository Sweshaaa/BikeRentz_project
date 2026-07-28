import Bike, { IBike } from "../models/Bike";

interface BikeFilter {
  type?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export class BikeRepository {
  create(data: Partial<IBike>) {
    return Bike.create(data);
  }

  findById(id: string) {
    return Bike.findById(id).populate("addedBy", "name email");
  }

  findAll(filter: BikeFilter = {}) {
    const query: Record<string, unknown> = {};

    if (filter.type) query.type = filter.type;
    if (filter.category) query.category = filter.category;
    if (filter.status) query.status = filter.status;
    if (filter.minPrice || filter.maxPrice) {
      query.pricePerDay = {
        ...(filter.minPrice ? { $gte: filter.minPrice } : {}),
        ...(filter.maxPrice ? { $lte: filter.maxPrice } : {}),
      };
    }
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { brand: { $regex: filter.search, $options: "i" } },
      ];
    }

    return Bike.find(query).sort({ createdAt: -1 });
  }

  update(id: string, data: Partial<IBike>) {
    return Bike.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return Bike.findByIdAndDelete(id);
  }

  setStatus(id: string, status: IBike["status"]) {
    return Bike.findByIdAndUpdate(id, { status }, { new: true });
  }
}
