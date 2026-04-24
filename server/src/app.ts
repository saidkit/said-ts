// Web composition root — all DI wiring happens here
import type { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { type Config, loadConfig } from "@config/config.js";
import { type Logger, createLogger } from "@lib/logger.js";
import { createPrismaClient } from "@lib/prisma.js";
import { bearerAuth } from "./middleware/auth.js";
import { createErrorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { createHealthModule } from "@features/health/health.module.js";
import { HealthService } from "@features/health/health.service.js";
import { createUsersModule } from "@features/users/users.module.js";
import { UsersService } from "@features/users/users.service.js";

export interface AppDeps {
  config: Config;
  logger: Logger;
  prisma: PrismaClient;
}

export function createApp(overrides?: Partial<AppDeps>) {
  const config = overrides?.config ?? loadConfig();
  const logger = overrides?.logger ?? createLogger(config);
  const prisma = overrides?.prisma ?? createPrismaClient(config);

  const app = new Hono();

  // Global middleware
  app.use("*", requestLogger(logger));
  app.use(
    "*",
    cors({
      origin: config.NODE_ENV === "production" ? [] : ["*"],
      credentials: true,
    }),
  );

  // Global error handler
  app.onError(createErrorHandler(logger));

  // Root endpoint
  app.get("/", (c) => c.json({ status: "ok", name: "said-ts" }));

  // Mount features
  const healthService = new HealthService(prisma);
  app.route("/api/v1/health", createHealthModule(healthService));

  const usersService = new UsersService(prisma);
  const authMiddleware = config.NODE_ENV === "test" ? undefined : bearerAuth(config.JWT_SECRET);
  app.route("/api/v1/users", createUsersModule(usersService, authMiddleware));

  return { app, config, logger, prisma };
}
