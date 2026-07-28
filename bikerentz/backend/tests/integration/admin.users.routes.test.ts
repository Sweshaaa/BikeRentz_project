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
  return { token: res.body.data.accessToken as string, id: res.body.data.user._id as string };
}

describe("Admin user-management routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("GET /api/admin/users requires authentication", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  it("blocks a non-admin user with 403", async () => {
    const { token } = await registerAndLogin("plainuser@test.com");
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("allows an admin to list users", async () => {
    const { token } = await registerAndLogin("adminlist@test.com", "admin");
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("lets an admin promote a user to admin", async () => {
    const { token: adminToken } = await registerAndLogin("admin1@test.com", "admin");
    const { id: userId } = await registerAndLogin("promoteme@test.com");

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("admin");
  });

  it("blocks an admin from demoting themselves", async () => {
    const { token, id } = await registerAndLogin("selfdemote@test.com", "admin");
    const res = await request(app)
      .patch(`/api/admin/users/${id}/role`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "user" });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid role value", async () => {
    const { token: adminToken } = await registerAndLogin("admin2@test.com", "admin");
    const { id: userId } = await registerAndLogin("target@test.com");

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "superadmin" });
    expect(res.status).toBe(400);
  });
});
