import { describe, expect, it } from "bun:test";
import { signToken, verifyToken } from "./auth.js";

const SECRET = "test-secret-key-for-jwt";

describe("Auth (JWT)", () => {
  it("signs and verifies a token", async () => {
    const payload = { sub: "user-1", email: "test@example.com" };
    const token = await signToken(payload, SECRET);

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT has 3 parts

    const verified = await verifyToken(token, SECRET);
    expect(verified.sub).toBe("user-1");
    expect(verified.email).toBe("test@example.com");
  });

  it("rejects token with wrong secret", async () => {
    const token = await signToken({ sub: "user-1", email: "a@b.com" }, SECRET);

    expect(verifyToken(token, "wrong-secret")).rejects.toThrow();
  });

  it("rejects expired token", async () => {
    const token = await signToken({ sub: "user-1", email: "a@b.com" }, SECRET, "0s");

    // Token expires immediately
    expect(verifyToken(token, SECRET)).rejects.toThrow();
  });

  it("includes iat claim", async () => {
    const token = await signToken({ sub: "user-1", email: "a@b.com" }, SECRET);
    const verified = await verifyToken(token, SECRET);
    expect(verified.iat).toBeDefined();
  });
});
