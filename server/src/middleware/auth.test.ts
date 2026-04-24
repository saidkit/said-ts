import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { signToken } from "@lib/auth.js";
import { bearerAuth } from "./auth.js";
import { createErrorHandler } from "./error-handler.js";
import pino from "pino";

const SECRET = "test-middleware-secret";
const logger = pino({ level: "silent" });

function createTestApp() {
  const app = new Hono();
  app.onError(createErrorHandler(logger));
  app.use("/protected/*", bearerAuth(SECRET));
  app.get("/protected/data", (c) => c.json({ user: c.get("user") }));
  app.get("/public", (c) => c.json({ ok: true }));
  return app;
}

describe("bearerAuth middleware", () => {
  const app = createTestApp();

  it("allows request with valid token", async () => {
    const token = await signToken({ sub: "user-1", email: "a@b.com" }, SECRET);
    const res = await app.request("/protected/data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.sub).toBe("user-1");
    expect(body.user.email).toBe("a@b.com");
  });

  it("rejects request without Authorization header", async () => {
    const res = await app.request("/protected/data");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain("Authorization");
  });

  it("rejects request with invalid token", async () => {
    const res = await app.request("/protected/data", {
      headers: { Authorization: "Bearer invalid.token.here" },
    });
    expect(res.status).toBe(401);
  });

  it("rejects request with wrong scheme", async () => {
    const res = await app.request("/protected/data", {
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });
    expect(res.status).toBe(401);
  });

  it("does not affect unprotected routes", async () => {
    const res = await app.request("/public");
    expect(res.status).toBe(200);
  });
});
