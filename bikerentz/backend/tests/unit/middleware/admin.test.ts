import { Request, Response } from "express";
import { requireAdmin } from "../../../src/middleware/admin";

describe("requireAdmin middleware", () => {
  it("rejects non-admin users", () => {
    const req = { user: { id: "1", email: "a@b.com", role: "user" } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it("allows admin users", () => {
    const req = { user: { id: "1", email: "a@b.com", role: "admin" } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
