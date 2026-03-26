import type { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { type Config, loadConfig } from "./config";
import { type Logger, createLogger } from "./lib/logger";
import { createPrismaClient } from "./lib/prisma";
import { bearerAuth } from "./middleware/auth";
import { createErrorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

import { createHealthModule } from "./features/health/health.module";
import { HealthService } from "./features/health/health.service";
import { createUsersModule } from "./features/users/users.module";
import { UsersService } from "./features/users/users.service";

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
  app.get("/", (c) => c.json({ status: "ok", name: "template-ts-dev" }));

  // Mount features
  const healthService = new HealthService(prisma);
  app.route("/api/v1/health", createHealthModule(healthService));

  const usersService = new UsersService(prisma);
  const authMiddleware = config.NODE_ENV === "test" ? undefined : bearerAuth(config.JWT_SECRET);
  app.route("/api/v1/users", createUsersModule(usersService, authMiddleware));

  return { app, config, logger, prisma };
}
