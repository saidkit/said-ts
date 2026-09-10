// Minimal MCP tool test — exercises the health MCP tool through the ok() envelope.
// Handler-level: construct the feature's tool factory over its service and assert the
// McpToolResult shape lib/mcp.ts produces. This is what makes `make test` re-derive a
// real MCP verdict (the mcp-surface Checker's recompute is nominal without it).
import { describe, expect, it } from "bun:test";
import { loadConfig } from "@config/config.js";
import { createPrismaClient } from "@lib/prisma.js";
import { HealthService } from "@features/health/health.service.js";
import { createHealthTools } from "@features/health/health.tools.js";

describe("Health MCP tool", () => {
  it("health_check returns the ok() McpToolResult envelope with the service payload", async () => {
    const config = loadConfig();
    const prisma = createPrismaClient(config);
    const tools = createHealthTools(new HealthService(prisma));

    const result = await tools.healthCheck({});

    // ok() envelope shape (lib/mcp.ts): { content: [{ type: "text", text: <json> }], isError? }
    expect(result.isError ?? false).toBe(false);
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0]?.type).toBe("text");

    // The tool wraps the service result verbatim; assert the health payload shape.
    // (check() degrades rather than throws on a DB miss, so these keys hold either way.)
    const payload = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(payload.status).toBeDefined();
    expect(payload.services).toBeDefined();
    expect(payload.timestamp).toBeDefined();
  });
});
