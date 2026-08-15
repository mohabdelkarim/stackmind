# CLAUDE.md — Next.js 15

## Project
Next.js 15 App Router, TypeScript strict, React 19 Server Components,
Tailwind CSS 4, shadcn/ui, Prisma + PostgreSQL, NextAuth v5, Vitest, Playwright, Vercel.

## Conventions
- Functional components, named exports preferred, `@/` absolute imports when configured
- No `any`; validate external data with Zod
- Server Components by default; `"use client"` only when needed
- Business logic in `lib/` or server actions, not in thick page components

## Key files
- `app/layout.tsx` — root layout
- `lib/env.ts` — Zod env validation
- `lib/db.ts` — Prisma client
- `prisma/schema.prisma` — schema

## Commands
- `npm run dev` / `npm run build` / `npm run test`
- `npx prisma migrate dev` / `npx prisma studio`

## Env
`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`

## Expect
Brief plan, full file paths, production ready code, no committed secrets.
