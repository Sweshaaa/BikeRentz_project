import "../setup/env";
import request from "supertest";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import app from "../../src/app";

async function registerAndLogin(email: string) {
  const res = await request(app).post("/api/auth/register").send({
    name: "Profile Tester",
    email,
    password: "password123",
  });
  return res.body.data.accessToken as string;
}

describe("User routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("GET /api/users/me requires authentication", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/users/me returns the logged-in user's profile", async () => {
    const token = await registerAndLogin("profile@test.com");
    const res = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("profile@test.com");
  });

  it("PUT /api/users/me updates the user's name", async () => {
    const token = await registerAndLogin("update@test.com");
    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });
});
