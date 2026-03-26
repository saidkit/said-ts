import type { MiddlewareHandler } from "hono";
import { type TokenPayload, verifyToken } from "../lib/auth";
import { AppError } from "../lib/errors";

declare module "hono" {
  interface ContextVariableMap {
    user: TokenPayload;
  }
}

export function bearerAuth(secret: string): MiddlewareHandler {
  return async (c, next) => {
    const header = c.req.header("Authorization");
    if (!header?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Missing or invalid Authorization header");
    }

    const token = header.slice(7);
    try {
      const payload = await verifyToken(token, secret);
      c.set("user", payload);
    } catch {
      throw AppError.unauthorized("Invalid or expired token");
    }

    await next();
  };
}
