// Health feature — MCP tool entry point
import type { McpToolResult } from "@lib/mcp.js";
import { ok } from "@lib/mcp.js";
import type { HealthService } from "./health.service.js";
import type { HealthCheckInput } from "./health.schema.js";

export function createHealthTools(service: HealthService) {
  return {
    healthCheck: async (_args: HealthCheckInput): Promise<McpToolResult> => {
      const result = await service.check();
      return ok(result);
    },
  };
}
