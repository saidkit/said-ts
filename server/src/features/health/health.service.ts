// Health check service — shared by Web and MCP entry points
import type { PrismaClient } from "@prisma/client";
import type { HealthResponse } from "./health.schema.js";

const startTime = Date.now();

export class HealthService {
  constructor(private prisma: PrismaClient) {}

  async check(): Promise<HealthResponse> {
    const services: Record<string, string> = {};
    let status: HealthResponse["status"] = "healthy";

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      services.database = "healthy";
    } catch (err) {
      status = "degraded";
      services.database = `unhealthy: ${err instanceof Error ? err.message : "unknown"}`;
    }

    return {
      status,
      version: process.env.npm_package_version ?? "dev",
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
