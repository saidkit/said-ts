FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build
FROM base AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Uncomment if using Prisma:
# RUN bunx prisma generate

# Production
FROM oven/bun:1-slim AS production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./
COPY --from=build /app/tsconfig.json ./
# Uncomment if using Prisma:
# COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

# Web layer: bun run src/app.ts
# MCP layer: bun run src/index.ts
CMD ["bun", "run", "src/app.ts"]
