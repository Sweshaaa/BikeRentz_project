import "../setup/env";
import request from "supertest";
import { connectTestDB, clearTestDB, disconnectTestDB } from "../setup/db";
import app from "../../src/app";

describe("Auth routes", () => {
  beforeAll(async () => connectTestDB());
  afterEach(async () => clearTestDB());
  afterAll(async () => disconnectTestDB());

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "rider@test.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe("rider@test.com");
  });

  it("rejects duplicate registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "rider@test.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Rider 2",
      email: "rider@test.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "rider2@test.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "rider2@test.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "rider3@test.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "rider3@test.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("rejects login for an email that was never registered", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@test.com",
      password: "password123",
    });
    expect(res.status).toBe(401);
  });

  it("rejects registration with a too-short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "shortpass@test.com",
      password: "123",
    });
    expect(res.status).toBe(400);
  });

  it("rejects registration with an invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Rider",
      email: "not-an-email",
      password: "password123",
    });
    expect(res.status).toBe(400);
  });

  it("registers an admin when role=admin is provided", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin Rider",
      email: "adminrider@test.com",
      password: "password123",
      role: "admin",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("admin");
  });

  it("logs out and clears auth cookies", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] as unknown as string[] | undefined;
    expect(cookies?.some((c) => c.startsWith("accessToken=;"))).toBe(true);
  });

  it("does not leak whether an email exists on forgot-password", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({
      email: "doesnotexist@test.com",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects reset-password with an invalid token", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({
      token: "not-a-real-token",
      password: "newpassword123",
    });
    expect(res.status).toBe(400);
  });
});
