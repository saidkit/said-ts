import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  version: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
  services: z.record(z.string(), z.string()),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
