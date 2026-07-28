import "../setup/env";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import app from "../../src/app";
import Bike from "../../src/models/Bike";

describe("Bike routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("GET /api/bikes returns an empty list initially", async () => {
    const res = await request(app).get("/api/bikes");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("GET /api/bikes/:id returns 404 for unknown bike", async () => {
    const res = await request(app).get("/api/bikes/64b6f0f0f0f0f0f0f0f0f0f0");
    expect(res.status).toBe(404);
  });

  it("filters bikes by type", async () => {
    const addedBy = new mongoose.Types.ObjectId();
    await Bike.create({
      name: "Duke 390", brand: "KTM", type: "Motorbike", category: "Sports",
      pricePerDay: 2500, image: "/bikes/duke.jpg", addedBy,
    });
    await Bike.create({
      name: "Activa 6G", brand: "Honda", type: "Scooter", category: "Commuter",
      pricePerDay: 900, image: "/bikes/activa.jpg", addedBy,
    });

    const res = await request(app).get("/api/bikes?type=Scooter");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Activa 6G");
  });

  it("searches bikes by name", async () => {
    const addedBy = new mongoose.Types.ObjectId();
    await Bike.create({
      name: "Classic 350", brand: "Royal Enfield", type: "Motorbike", category: "Cruiser",
      pricePerDay: 1800, image: "/bikes/classic.jpg", addedBy,
    });

    const res = await request(app).get("/api/bikes?search=classic");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].brand).toBe("Royal Enfield");
  });
});
