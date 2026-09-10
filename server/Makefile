.PHONY: help setup dev dev-web start build test format lint check typecheck clean \
       db-generate db-push db-migrate db-seed db-studio \
       docker-build docker-dev docker-down pre-commit

# Default
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
setup: ## Install dependencies and setup database
	[ -f .env ] || cp .env.example .env
	bun install && bunx prisma generate && bunx prisma db push

dev: ## Start MCP server with hot reload
	bun run dev

dev-web: ## Start Web server with hot reload
	bun run dev:web

start: ## Start server (production, no hot reload)
	bun run start

build: ## Build for production
	bun run build

test: ## Run all tests
	bun test

format: ## Format code with Biome
	bun run format

lint: ## Lint code with Biome
	bun run lint

check: ## Format + lint with Biome
	bun run check

typecheck: ## Type-check with TypeScript
	bunx tsc --noEmit

clean: ## Remove build artifacts
	rm -rf dist node_modules

# Database
db-generate: ## Generate Prisma client
	bunx prisma generate

db-push: ## Push schema to database (dev)
	bunx prisma db push

db-migrate: ## Create and apply migration
	bunx prisma migrate dev

db-seed: ## Seed the database
	bun run db:seed

db-studio: ## Open Prisma Studio
	bunx prisma studio

# Docker
docker-build: ## Build Docker image
	docker compose build

docker-dev: ## Start all services with Docker Compose
	docker compose up

docker-down: ## Stop all services
	docker compose down

# Quality gates
pre-commit: format lint typecheck test ## Run all quality checks
