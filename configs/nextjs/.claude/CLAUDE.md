# Claude Code Manual: Next.js 15

## Project
Next.js 15 App Router with TypeScript 5, Tailwind CSS 4, and shadcn/ui.
React 19 with Zustand and TanStack Query v5 for client-side state and data.
Prisma 6 + PostgreSQL, NextAuth v5, Vitest, Playwright, deployed on Vercel.

## Conventions
- Use strict TypeScript: no any, no unsafe as casts, enable strict mode in tsconfig.
- Prefer React Server Components by default; mark Client Components only when necessary.
- Use Zod to validate all external data (env vars, API responses, form inputs).
- Build UI with Tailwind CSS 4 and shadcn/ui components; keep design consistent.
- Keep pages and route handlers thin; move logic into lib/ and hooks/ modules.

## Key Files
- app/layout.tsx – root layout, theme providers, global styles.
- app/(auth)/ – authentication routes (login, register, callbacks).
- lib/env.ts – Zod-based environment schema and runtime validation.
- lib/db.ts – Prisma client instance and database helpers.
- prisma/schema.prisma – database schema and relations.

## Commands
- npm run dev
- npm run build
- npm run test
- npx prisma migrate dev
- npx prisma studio

## Environment Variables
- DATABASE_URL – PostgreSQL connection string used by Prisma.
- NEXTAUTH_SECRET – secret used to sign NextAuth tokens.
- NEXTAUTH_URL – canonical URL for NextAuth callbacks.
- NEXT_PUBLIC_APP_URL – public base URL for the application.

## What I expect
1. Small, focused changes with clear intent and descriptive commit messages.
2. Type-safe code with tests for important behavior and auth flows.
3. No secrets committed to git; use .env.local and deployment secrets instead.
4. ESLint and Prettier pass locally and in CI before opening a PR.
5. Clear PR notes when introducing migrations or new environment variables.
