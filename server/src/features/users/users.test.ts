import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { execSync } from "node:child_process";
import type { PrismaClient } from "@prisma/client";
import { createApp } from "../../app";

let prisma: PrismaClient;

// Push schema to test DB before running tests
beforeAll(() => {
  execSync("bunx prisma db push --skip-generate", {
    env: { ...process.env, DATABASE_URL: "file:./prisma/test.db" },
    stdio: "ignore",
  });
});

describe("Users", () => {
  const { app, prisma: p } = createApp();
  prisma = p;

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("GET /api/v1/users returns empty array initially", async () => {
    const res = await app.request("/api/v1/users");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  it("POST /api/v1/users creates a user", async () => {
    const res = await app.request("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", name: "Test User" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.email).toBe("test@example.com");
    expect(body.name).toBe("Test User");
    expect(body.id).toBeDefined();
  });

  it("GET /api/v1/users returns created user", async () => {
    const res = await app.request("/api/v1/users");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBe(1);
    expect(body[0].email).toBe("test@example.com");
  });

  it("POST /api/v1/users rejects duplicate email", async () => {
    const res = await app.request("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", name: "Duplicate" }),
    });
    expect(res.status).toBe(400);
  });
});
