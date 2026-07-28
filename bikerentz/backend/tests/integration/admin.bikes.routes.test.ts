import "../setup/env";
import request from "supertest";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import app from "../../src/app";

async function registerAndLogin(email: string, role?: "user" | "admin") {
  const res = await request(app).post("/api/auth/register").send({
    name: "Test Account",
    email,
    password: "password123",
    role,
  });
  return res.body.data.accessToken as string;
}

describe("Admin bike-management routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("blocks a non-admin from creating a bike", async () => {
    const token = await registerAndLogin("nonadmin@test.com");
    const res = await request(app)
      .post("/api/admin/bikes")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Duke 390")
      .field("brand", "KTM")
      .field("type", "Motorbike")
      .field("category", "Sports")
      .field("pricePerDay", "2500");
    expect(res.status).toBe(403);
  });

  it("rejects bike creation without an image", async () => {
    const token = await registerAndLogin("admin3@test.com", "admin");
    const res = await request(app)
      .post("/api/admin/bikes")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Duke 390")
      .field("brand", "KTM")
      .field("type", "Motorbike")
      .field("category", "Sports")
      .field("pricePerDay", "2500");
    expect(res.status).toBe(400);
  });

  it("creates a bike with an image and then deletes it", async () => {
    const token = await registerAndLogin("admin4@test.com", "admin");
    const createRes = await request(app)
      .post("/api/admin/bikes")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Duke 390")
      .field("brand", "KTM")
      .field("type", "Motorbike")
      .field("category", "Sports")
      .field("pricePerDay", "2500")
      .attach("image", Buffer.from("fake-image-bytes"), "duke.jpg");

    expect(createRes.status).toBe(201);
    const bikeId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/admin/bikes/${bikeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
  });
});
