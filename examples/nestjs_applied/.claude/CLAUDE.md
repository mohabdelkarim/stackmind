# CLAUDE.md — NestJS

## Project
NestJS + TypeScript strict, Prisma + PostgreSQL, modular features, Jest.

## Conventions
- One feature folder per domain: module, controller, service, dto
- Thin controllers; business logic in services
- Validate input at the boundary
- No `any`

## Key files
- `src/main.ts`
- `src/app.module.ts`
- `prisma/schema.prisma`

## Commands
- `npm run start:dev`
- `npm run build`
- `npm test`
- `npx prisma migrate dev`

## Env
`DATABASE_URL`, `PORT`, `NODE_ENV`

## Expect
Brief plan, full paths, typed Nest code, migrations when models change.
