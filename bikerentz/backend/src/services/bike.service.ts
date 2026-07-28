import { BikeRepository } from "../repositories/bike.repository";
import { ErrorResponse } from "../utils/errorResponse";
import { CreateBikeDTO, UpdateBikeDTO } from "../dtos/bike.dto";

const bikeRepo = new BikeRepository();

export class BikeService {
  async create(payload: CreateBikeDTO, image: string, addedBy: string) {
    return bikeRepo.create({ ...payload, image, addedBy: addedBy as unknown as never });
  }

  async list(filter: Record<string, string | undefined>) {
    return bikeRepo.findAll({
      type: filter.type,
      category: filter.category,
      status: filter.status,
      search: filter.search,
      minPrice: filter.minPrice ? Number(filter.minPrice) : undefined,
      maxPrice: filter.maxPrice ? Number(filter.maxPrice) : undefined,
    });
  }

  async getById(id: string) {
    const bike = await bikeRepo.findById(id);
    if (!bike) throw new ErrorResponse("Bike not found", 404);
    return bike;
  }

  async update(id: string, payload: UpdateBikeDTO, image?: string) {
    const data = image ? { ...payload, image } : payload;
    const bike = await bikeRepo.update(id, data);
    if (!bike) throw new ErrorResponse("Bike not found", 404);
    return bike;
  }

  async delete(id: string) {
    const bike = await bikeRepo.delete(id);
    if (!bike) throw new ErrorResponse("Bike not found", 404);
    return bike;
  }

  async setStatus(id: string, status: "AVAILABLE" | "RENTED" | "MAINTENANCE") {
    const bike = await bikeRepo.setStatus(id, status);
    if (!bike) throw new ErrorResponse("Bike not found", 404);
    return bike;
  }
}
