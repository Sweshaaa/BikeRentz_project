import "../setup/env";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import Bike from "../../src/models/Bike";

jest.mock("../../src/services/khalti.service", () => ({
  KhaltiService: jest.fn().mockImplementation(() => ({
    initiate: jest.fn().mockResolvedValue({
      pidx: "fake-pidx",
      payment_url: "https://test-pay.khalti.com/?pidx=fake-pidx",
      expires_at: new Date().toISOString(),
      expires_in: 1800,
    }),
    verify: jest.fn().mockResolvedValue({ status: "Completed" }),
  })),
}));

import app from "../../src/app";

async function registerAndLogin(email: string) {
  const res = await request(app).post("/api/auth/register").send({
    name: "Renter",
    email,
    password: "password123",
  });
  return res.body.data.accessToken as string;
}

async function createBike(overrides: Partial<Record<string, unknown>> = {}) {
  return Bike.create({
    name: "Activa 6G",
    brand: "Honda",
    type: "Scooter",
    category: "Commuter",
    pricePerDay: 1000,
    image: "/bikes/activa.jpg",
    addedBy: new mongoose.Types.ObjectId(),
    ...overrides,
  });
}

describe("Rental routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("POST /api/rentals requires authentication", async () => {
    const res = await request(app).post("/api/rentals").send({
      bikeId: new mongoose.Types.ObjectId().toString(),
      startDate: "2026-08-01",
      endDate: "2026-08-03",
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 when booking a bike that does not exist", async () => {
    const token = await registerAndLogin("renter1@test.com");
    const res = await request(app)
      .post("/api/rentals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bikeId: new mongoose.Types.ObjectId().toString(),
        startDate: "2026-08-01",
        endDate: "2026-08-03",
      });
    expect(res.status).toBe(404);
  });

  it("rejects a booking where endDate is before startDate", async () => {
    const token = await registerAndLogin("renter2@test.com");
    const bike = await createBike();
    const res = await request(app)
      .post("/api/rentals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bikeId: bike.id,
        startDate: "2026-08-05",
        endDate: "2026-08-01",
      });
    expect(res.status).toBe(400);
  });

  it("creates a booking and returns a Khalti payment URL", async () => {
    const token = await registerAndLogin("renter3@test.com");
    const bike = await createBike();
    const res = await request(app)
      .post("/api/rentals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bikeId: bike.id,
        startDate: "2026-08-01",
        endDate: "2026-08-03",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.paymentUrl).toBe("https://test-pay.khalti.com/?pidx=fake-pidx");
    expect(res.body.data.order.totalPrice).toBe(2000);
  });

  it("rejects a booking that overlaps an existing one", async () => {
    const token = await registerAndLogin("renter4@test.com");
    const bike = await createBike();
    await request(app)
      .post("/api/rentals")
      .set("Authorization", `Bearer ${token}`)
      .send({ bikeId: bike.id, startDate: "2026-08-01", endDate: "2026-08-05" });

    const res = await request(app)
      .post("/api/rentals")
      .set("Authorization", `Bearer ${token}`)
      .send({ bikeId: bike.id, startDate: "2026-08-03", endDate: "2026-08-06" });
    expect(res.status).toBe(409);
  });

  it("GET /api/rentals/mine requires authentication", async () => {
    const res = await request(app).get("/api/rentals/mine");
    expect(res.status).toBe(401);
  });
});
