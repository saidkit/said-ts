import { describe, expect, it } from "bun:test";
import { createApp } from "@app";

describe("Health", () => {
  it("GET /api/v1/health returns healthy status", async () => {
    const { app } = createApp();
    const res = await app.request("/api/v1/health");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.services).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });
});
