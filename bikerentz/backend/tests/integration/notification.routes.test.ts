import "../setup/env";
import request from "supertest";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import app from "../../src/app";

async function registerAndLogin(email: string) {
  const res = await request(app).post("/api/auth/register").send({
    name: "Notif Tester",
    email,
    password: "password123",
  });
  return res.body.data.accessToken as string;
}

describe("Notification routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("GET /api/notifications requires authentication", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
  });

  it("returns an empty list and zero unread count for a new user", async () => {
    const token = await registerAndLogin("notif1@test.com");
    const res = await request(app).get("/api/notifications").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.notifications).toEqual([]);
    expect(res.body.data.unreadCount).toBe(0);
  });

  it("PATCH /api/notifications/read-all requires authentication", async () => {
    const res = await request(app).patch("/api/notifications/read-all");
    expect(res.status).toBe(401);
  });
});
