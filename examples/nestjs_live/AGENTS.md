# AGENTS.md

> Canonical agent instructions. Cursor overlays: `.cursor/rules/*.mdc`. Claude notes: `.claude/CLAUDE.md`.

## Project Overview

NestJS API with TypeScript strict mode, modular architecture,
Prisma + PostgreSQL, validation at HTTP boundaries,
Jest for tests, Docker for local Postgres.

## Project structure

- `src/main.ts` bootstrap
- `src/app.module.ts` root module
- `src/<feature>/` modules (controller, service, dto, module)
- `prisma/` schema and migrations
- `test/` e2e tests

## [architect]

- Keep clear module boundaries per domain feature.
- Prefer thin controllers and services with explicit DTOs.
- Centralize config, logging, and filters in shared modules.

## [backend]

- Implement Nest modules with dependency injection.
- Validate all external input at the HTTP boundary.
- Use Prisma for persistence; avoid raw SQL unless justified.
- Return consistent error shapes via exception filters.

## [database]

- Evolve `prisma/schema.prisma` with migrations.
- Keep indexes aligned with query patterns.
- Never expose Prisma client directly from controllers.

## [reviewer]

- No `any`. Strict TypeScript.
- No secrets in source. Env via ConfigModule.
- Controllers stay thin. Tests cover critical paths.

## Global Rules

- Prefer constructor injection over manual instantiation.
- Feature folders over giant shared bags of files.
- Show full file paths when editing code.
- Never commit secrets.
