// MCP composition root — register tools here
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "@config/config.js";
import { createPrismaClient } from "@lib/prisma.js";
import { HealthService } from "@features/health/health.service.js";
import { createHealthTools } from "@features/health/health.tools.js";
import { HealthCheckInputSchema } from "@features/health/health.schema.js";

const config = loadConfig();
const prisma = createPrismaClient(config);
const healthService = new HealthService(prisma);
const health = createHealthTools(healthService);

const server = new McpServer({ name: "said-ts", version: "0.1.0" });

server.registerTool(
  "health_check",
  {
    description: "Check service health including database connectivity",
    inputSchema: HealthCheckInputSchema.shape,
  },
  health.healthCheck,
);

const transport = new StdioServerTransport();
await server.connect(transport);
