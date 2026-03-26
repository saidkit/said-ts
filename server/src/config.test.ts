import { describe, expect, it } from "bun:test";
import { loadConfig } from "./config";

describe("Config", () => {
  it("loads config from environment with defaults", () => {
    const config = loadConfig();
    expect(config.NODE_ENV).toBe("test"); // set by test/setup.ts
    expect(config.PORT).toBe(3000);
    expect(config.JWT_SECRET).toBe("test-secret"); // set by test/setup.ts
    expect(config.LOG_LEVEL).toBe("error"); // set by test/setup.ts
  });

  it("PORT coerces string to number", () => {
    const prev = process.env.PORT;
    process.env.PORT = "4000";
    try {
      const config = loadConfig();
      expect(config.PORT).toBe(4000);
      expect(typeof config.PORT).toBe("number");
    } finally {
      if (prev !== undefined) process.env.PORT = prev;
      else delete process.env.PORT;
    }
  });

  it("NODE_ENV defaults to development when not set", () => {
    const prev = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    try {
      const config = loadConfig();
      expect(config.NODE_ENV).toBe("development");
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
