# AGENTS.md

> Canonical agent instructions for this repo. Read by Cursor, Claude Code, Copilot, Gemini CLI, Windsurf, Codex, Aider, Zed, Warp, and RooCode.
> Cursor-scoped overlays live in `.cursor/rules/*.mdc`. Claude-specific commands and env notes live in `.claude/CLAUDE.md`.

## Project Overview

Next.js 15 App Router with TypeScript 5 and Tailwind CSS 4 UI when present.
shadcn/ui, React 19, Zod validation, Prisma + PostgreSQL and NextAuth when the app needs them.
Battle-tested against `examples/nextjs_live` (Server Components, `lib/env.ts`, `app/api/health`).

## Project structure

- `app/` routes, layouts, Server Components, route handlers
- `components/` shared UI
- `lib/` env, db, auth, pure helpers (keep pages thin)
- `hooks/` client hooks only when needed
- `types/` shared TypeScript types
- `prisma/` schema and migrations when using a database

## [architect]

- Define app structure, route groups, and shared layout patterns.
- Decide boundaries between React Server Components and Client Components.
- Keep cross-cutting concerns (env, logging, error handling) in `lib/`.

## [frontend]

- Prefer Server Components; add `"use client"` only for interactivity.
- Use Zod for forms and external payloads.
- Keep UI components small and accessible.

## [backend]

- Prefer Server Actions and `app/api/**/route.ts` handlers.
- Put reusable logic in `lib/`, not inside page files.
- Validate env with Zod in `lib/env.ts` before use.

## [database]

- Use Prisma when persistence is required.
- Review migrations before applying them.

## [reviewer]

- No `any`. Minimal unsafe casts.
- No secrets in git. Env via `.env.local`.
- Confirm Zod at boundaries and RSC defaults.

## Global Rules

- Strict TypeScript; treat type errors as failures.
- Early returns over deep nesting.
- Show full file paths when editing (example: `app/api/health/route.ts`).
- Call out required env vars when changing config or auth.
- Every meaningful change should be smoke tested (`examples/nextjs_live` pattern).

## Anti-patterns

- Do not mark every component `"use client"` by default.
- Do not put business logic in `page.tsx` or route handlers; use `lib/`.
- Do not use `process.env.X!` without Zod validation in `lib/env.ts`.
- Do not commit secrets, `.env.local`, or raw connection strings.
- Do not skip migrations after Prisma schema changes.

## Recipes

Snippet recipes ship under `stackmind_recipes/` after `stackmind init` (health route, Zod env, Prisma client).
