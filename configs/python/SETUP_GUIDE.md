# Python / FastAPI stackmind setup

Install the kit with the CLI, then verify each tool picks up the configs.

## Prerequisites

- Node.js 22+ (for the stackmind CLI)
- Python 3.12+
- A FastAPI project (or an empty folder you will scaffold next)
- Cursor and/or Claude Code installed

## Install

From your project root:

```bash
npx github:mohabdelkarim/stackmind init python
```

Or from a local clone of stackmind:

```bash
node /path/to/stackmind/bin/stackmind.js init python /path/to/your-project
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
2. Ask it to add a new route under `app/api/`.
3. Expect thin routers, Pydantic v2 models, and async SQLAlchemy patterns from `AGENTS.md`.

## Verify Claude Code

1. Confirm `.claude/CLAUDE.md` is present.
2. Ask: "How should I structure a new FastAPI feature?"
3. Expect mentions of `app/services/`, Alembic, and type hints.

## Verify MCP (Cursor)

Set these in the environment Cursor inherits, then restart Cursor:

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | postgres (CLI arg on the official server) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github |
| `BRAVE_API_KEY` | brave-search |

Filesystem is scoped to `${workspaceFolder}`. Never commit secrets.

## Customize

- Edit `AGENTS.md` for team-wide conventions (single source of truth).
- Keep `.cursor/rules/*.mdc` short and glob-scoped.
- Keep `.claude/CLAUDE.md` for commands, key files, and env vars.
