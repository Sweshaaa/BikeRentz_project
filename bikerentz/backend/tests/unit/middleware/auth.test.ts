import "../../setup/env";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { protect } from "../../../src/middleware/auth";

describe("protect middleware", () => {
  it("calls next with an error when no token is provided", () => {
    const req = { cookies: {}, headers: {} } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    protect(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("attaches user to request when token is valid", () => {
    const token = jwt.sign(
      { id: "123", email: "a@b.com", role: "user" },
      process.env.JWT_ACCESS_SECRET as string
    );
    const req = { cookies: { accessToken: token }, headers: {} } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    protect(req, res, next);

    expect(req.user).toMatchObject({ id: "123", email: "a@b.com", role: "user" });
    expect(next).toHaveBeenCalledWith();
  });
});
