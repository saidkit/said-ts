import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const userIdParamSchema = z.object({
  id: z.string(),
});

export const errorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
