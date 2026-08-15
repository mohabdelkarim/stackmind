# AGENTS.md

> Canonical agent instructions for this repo. Read by Cursor, Claude Code, Copilot, Gemini CLI, Windsurf, Codex, Aider, Zed, Warp, and RooCode.
> Cursor-scoped overlays live in `.cursor/rules/*.mdc`. Claude-specific commands and env notes live in `.claude/CLAUDE.md`.

## Project Overview

Next.js 15 App Router with TypeScript 5 and Tailwind CSS 4 UI.
shadcn/ui components, React 19, Zustand, TanStack Query v5.
Prisma 6 + PostgreSQL, NextAuth v5, Vitest, Playwright, deployed on Vercel.

## Project structure

- `app/` routes, layouts, Server Components
- `components/` shared UI
- `lib/` env, db, auth, utilities
- `hooks/` client hooks
- `types/` shared TypeScript types
- `prisma/` schema and migrations

## [architect]

- Define app structure, route groups, and shared layout patterns.
- Decide boundaries between React Server Components and Client Components.
- Ensure performance and Core Web Vitals remain a first-class concern.
- Keep cross-cutting concerns (env, logging, error handling) centralized.

## [frontend]

- Implement React Server Components and Client Components where appropriate.
- Build UI with Tailwind CSS 4 and shadcn/ui, keeping components accessible.
- Use Zod + react-hook-form (or equivalent) for type-safe forms and validation.
- Maintain a clean component hierarchy with small, composable units.

## [backend]

- Implement Server Actions, route handlers, and API routes.
- Use Prisma 6 for queries and mutations against PostgreSQL.
- Configure NextAuth v5 for authentication and session handling.
- Add robust error handling, logging, and rate limiting where needed.

## [database]

- Design and evolve the Prisma schema in `prisma/schema.prisma`.
- Manage migrations and review diffs before applying them.
- Optimize queries and indexes for common access patterns.
- Coordinate connection pooling and database settings for production.

## [reviewer]

- Enforce strict TypeScript: no `any` and minimal unsafe casts.
- Ensure no secrets or credentials appear in the code or configs.
- Check that Zod is applied to all external inputs and env vars.
- Watch for accessibility issues, bundle size regressions, and migration notes.

## Global Rules

- Use strict TypeScript across the codebase; treat type errors as build failures.
- Prefer React Server Components by default; only opt into Client Components when necessary.
- Validate all external data with Zod before use (env, forms, webhooks, APIs).
- Never commit secrets; keep them in `.env.local`, secret managers, or deployment settings.
- Define and validate environment variables with Zod in `lib/env.ts`.
- Favor early returns over deeply nested conditionals.
- Prefer descriptive names over terse abbreviations.
- Avoid `index.ts` barrel files that hide concrete imports.
- Favor small, composable components and modules instead of large monoliths.
- Ensure every meaningful change ships with tests and passes linting/formatting.
- When generating or editing code, show the full file path (for example `app/(auth)/login/page.tsx`).
- Call out required environment variables whenever changing configuration or authentication.
