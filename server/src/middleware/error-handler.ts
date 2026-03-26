import type { ErrorHandler as HonoErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "../lib/errors";
import type { Logger } from "../lib/logger";

export function createErrorHandler(logger: Logger): HonoErrorHandler {
  return (err, c) => {
    if (err instanceof AppError) {
      logger.warn({ statusCode: err.statusCode, code: err.code }, err.message);
      return c.json({ error: err.message, code: err.code }, err.statusCode as ContentfulStatusCode);
    }

    logger.error({ err }, "Unhandled error");
    return c.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, 500);
  };
}
