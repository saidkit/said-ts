import { Hono } from "hono";
import type { HealthService } from "./health.service";

export function createHealthModule(service: HealthService) {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await service.check();
    const status = result.status === "healthy" ? 200 : 503;
    return c.json(result, status);
  });

  return app;
}
