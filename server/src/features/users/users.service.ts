import type { PrismaClient } from "@prisma/client";
import { AppError } from "../../lib/errors";
import type { CreateUserInput } from "./users.schema";

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw AppError.notFound(`User ${id} not found`);
    return user;
  }

  async create(input: CreateUserInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw AppError.badRequest(`Email ${input.email} already exists`);
    }
    return this.prisma.user.create({ data: input });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
