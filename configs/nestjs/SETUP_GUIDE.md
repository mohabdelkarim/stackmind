# NestJS stackmind setup

## Install

```bash
npx github:mohabdelkarim/stackmind init nestjs
npx github:mohabdelkarim/stackmind doctor .
```

## Verify agents

Ask: "Where should a new feature module live, and how thin should controllers be?"

Expect: `src/<feature>/` with module/controller/service/dto, thin controllers, Prisma in services.

## Verify MCP (Cursor)

Set in the environment Cursor inherits, then restart Cursor:

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | postgres (CLI arg) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github |

Filesystem is scoped to `${workspaceFolder}`. Never commit secrets.
