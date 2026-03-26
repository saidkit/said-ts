import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import pino from "pino";
import { AppError } from "../lib/errors";
import { createErrorHandler } from "./error-handler";

const logger = pino({ level: "silent" });

function createTestApp() {
  const app = new Hono();
  app.onError(createErrorHandler(logger));

  app.get("/app-error", () => {
    throw AppError.notFound("Thing not found");
  });

  app.get("/unknown-error", () => {
    throw new Error("Something unexpected");
  });

  app.get("/ok", (c) => c.json({ ok: true }));

  return app;
}

describe("Error handler middleware", () => {
  const app = createTestApp();

  it("converts AppError to JSON with correct status", async () => {
    const res = await app.request("/app-error");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Thing not found");
    expect(body.code).toBe("NOT_FOUND");
  });

  it("converts unknown errors to 500", async () => {
    const res = await app.request("/unknown-error");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
    expect(body.code).toBe("INTERNAL_ERROR");
  });

  it("does not affect successful responses", async () => {
    const res = await app.request("/ok");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
