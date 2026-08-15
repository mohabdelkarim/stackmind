# Demo and proof

This document is the reproducible proof that stackmind installs correctly. Record a short screen capture of these steps if you want a video for social posts; link it here when published.

## Automated proof

From the repo root:

```bash
npm ci
npm run demo_proof
```

Expected: exit code 0, doctor pass, and a temp project containing `AGENTS.md`, `.claude/CLAUDE.md`, `.cursor/rules/*.mdc`, and MCP JSON files.

## Manual proof (Next.js)

1. Create or open a Next.js app directory.
2. Run `npx github:mohabdelkarim/stackmind init nextjs . --force`
3. Restart Cursor or Claude Code.
4. Ask: "What stack and folder conventions does this project use?"
5. Expect: App Router, TypeScript, Prisma, Zod, Server Components by default, paths under `app/` and `lib/`.

### Before / after

| Before | After |
|--------|-------|
| Agent invents random folder layout | Uses `app/`, `components/`, `lib/`, `prisma/` |
| Suggests Client Components everywhere | Prefers Server Components; `"use client"` only when needed |
| Forgets env validation | Points at Zod + `lib/env.ts` |
| MCP missing or unpinned | `.cursor/mcp.json` has pinned `@package@version` servers |

## Manual proof (FastAPI)

1. Open a FastAPI project directory.
2. Run `npx github:mohabdelkarim/stackmind init python . --force`
3. Ask: "Where should business logic live, and how do we run migrations?"
4. Expect: `app/services/` for domain logic, Alembic commands from `CLAUDE.md`.

## Video (optional)

When you record a Loom or YouTube clip of the steps above, add the URL below:

- Video URL: _(add when published)_
