import { describe, expect, it } from "bun:test";
import { AppError } from "./errors";

describe("AppError", () => {
  it("creates error with status code and message", () => {
    const err = new AppError(418, "I'm a teapot", "TEAPOT");
    expect(err.statusCode).toBe(418);
    expect(err.message).toBe("I'm a teapot");
    expect(err.code).toBe("TEAPOT");
    expect(err.name).toBe("AppError");
    expect(err instanceof Error).toBe(true);
  });

  it("badRequest creates 400 error", () => {
    const err = AppError.badRequest("Invalid input");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Invalid input");
  });

  it("unauthorized creates 401 error", () => {
    const err = AppError.unauthorized();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("forbidden creates 403 error", () => {
    const err = AppError.forbidden();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
  });

  it("notFound creates 404 error", () => {
    const err = AppError.notFound("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("User not found");
    expect(err.code).toBe("NOT_FOUND");
  });

  it("internal creates 500 error", () => {
    const err = AppError.internal();
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe("INTERNAL_ERROR");
  });
});
