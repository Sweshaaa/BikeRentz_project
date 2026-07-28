import { ApiResponse } from "../../../src/utils/apiResponse";
import { Response } from "express";

function mockRes() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("ApiResponse", () => {
  it("formats a success response", () => {
    const res = mockRes();
    ApiResponse.success(res, "ok", { a: 1 }, 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "ok", data: { a: 1 } });
  });

  it("formats an error response", () => {
    const res = mockRes();
    ApiResponse.error(res, "bad", 400);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "bad", errors: null });
  });
});
