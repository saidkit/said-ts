// Users feature — Web (Hono) entry point
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { createUserSchema, userIdParamSchema } from "./users.schema.js";
import type { UsersService } from "./users.service.js";

export function createUsersModule(service: UsersService, authMiddleware?: MiddlewareHandler) {
  const app = new Hono();

  // GET /users — public
  app.get("/", async (c) => {
    const users = await service.list();
    return c.json(users.map(serializeUser));
  });

  // GET /users/:id — public
  app.get("/:id", zValidator("param", userIdParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = await service.getById(id);
    return c.json(serializeUser(user));
  });

  // POST /users — protected (requires auth)
  if (authMiddleware) {
    app.post("/*", authMiddleware);
    app.delete("/*", authMiddleware);
  }

  app.post("/", zValidator("json", createUserSchema), async (c) => {
    const body = c.req.valid("json");
    const user = await service.create(body);
    return c.json(serializeUser(user), 201);
  });

  // DELETE /users/:id — protected
  app.delete("/:id", zValidator("param", userIdParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    await service.delete(id);
    return c.body(null, 204);
  });

  return app;
}

function serializeUser(user: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
