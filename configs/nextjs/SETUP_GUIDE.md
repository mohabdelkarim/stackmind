# Next.js 15 stackmind setup

Install the kit with the CLI, then verify each tool picks up the configs.

## Prerequisites

- Node.js 22+
- A Next.js project (or an empty folder you will scaffold next)
- Cursor and/or Claude Code installed

## Install

From your project root:

```bash
npx github:mohabdelkarim/stackmind init nextjs
```

Or from a local clone of stackmind:

```bash
node /path/to/stackmind/bin/stackmind.js init nextjs /path/to/your-project
```

Useful flags: `--force`, `--dry-run`, `--diff`, `--no-mcp`, `--mcp-only`.

Then run:

```bash
npx github:mohabdelkarim/stackmind doctor .
```

## What gets written

| Source | Destination |
|--------|-------------|
| `AGENTS.md` | project root (canonical rules for all agents) |
| `.claude/CLAUDE.md` | Claude Code project manual |
| `.cursor/rules/*.mdc` | Cursor glob-scoped overlays |
| `mcp/mcp_config.json` | `.cursor/mcp.json` (merged) + `stackmind.mcp.json` |
| `recipes/*.md` | `stackmind_recipes/` |

Legacy `.cursorrules` is not installed. Prefer `AGENTS.md` + `.cursor/rules/`.

## Verify Cursor

1. Restart Cursor.
2. Ask it to scaffold `app/(auth)/login/page.tsx`.
3. Expect strict TypeScript, Server Components by default, and structure from `AGENTS.md`.

## Verify Claude Code

1. Confirm `.claude/CLAUDE.md` is present.
2. Ask: "How should I structure a new feature in this Next.js app?"
3. Expect mentions of Server Components, Zod, Prisma, and NextAuth.

## Verify MCP (Cursor)

`.cursor/mcp.json` uses Cursor interpolation. Set these in the environment Cursor inherits, then restart Cursor:

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | postgres (passed as a **CLI arg**, not a fake env key) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github |
| `BRAVE_API_KEY` | brave-search |
| `NOTION_TOKEN` | notion (local server) |

Filesystem is scoped to `${workspaceFolder}` (this project). No `MCP_FS_ROOT` env var.

Optional: copy Stripe / Supabase snippets from `configs/nextjs/mcp/snippets/` only when needed.

Security: never commit secrets. Prefer restricted / read-only credentials for agent tools.

## Customize

- Edit `AGENTS.md` for team-wide conventions (single source of truth).
- Keep `.cursor/rules/*.mdc` short and glob-scoped.
- Keep `.claude/CLAUDE.md` for commands, key files, and env vars.
