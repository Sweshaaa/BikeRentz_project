import "../../setup/env";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../../setup/db";
import { BikeService } from "../../../src/services/bike.service";
import mongoose from "mongoose";

describe("BikeService", () => {
  const bikeService = new BikeService();
  const fakeAdminId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("creates and retrieves a bike", async () => {
    const created = await bikeService.create(
      {
        name: "Duke 390",
        brand: "KTM",
        type: "Motorbike",
        category: "Sports",
        pricePerDay: 2500,
      },
      "/bikes/duke.jpg",
      fakeAdminId
    );

    const found = await bikeService.getById(created.id);
    expect(found.name).toBe("Duke 390");
    expect(found.status).toBe("AVAILABLE");
  });

  it("throws when bike is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(bikeService.getById(fakeId)).rejects.toThrow("Bike not found");
  });
});
