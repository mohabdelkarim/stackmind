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

Useful flags: `--force`, `--dry-run`, `--no-mcp`, `--mcp-only`.

## What gets written

| Source | Destination |
|--------|-------------|
| `AGENTS.md` | project root (canonical rules for all agents) |
| `.claude/CLAUDE.md` | Claude Code project manual |
| `.cursor/rules/python_fastapi.mdc` | Cursor glob-scoped overlay |
| `mcp/mcp_config.json` | `.cursor/mcp.json` (merged) + `stackmind.mcp.json` |

Legacy `.cursorrules` is not installed. Prefer `AGENTS.md` + `.cursor/rules/`.

## Verify Cursor

1. Restart Cursor.
2. Ask it to add a new route under `app/api/`.
3. Expect thin routers, Pydantic v2 models, and async SQLAlchemy patterns from `AGENTS.md`.

## Verify Claude Code

1. Confirm `.claude/CLAUDE.md` is present.
2. Ask: "How should I structure a new FastAPI feature?"
3. Expect mentions of `app/services/`, Alembic, and type hints.

## Verify MCP

1. Set env vars as needed: `POSTGRES_DSN`, `GITHUB_TOKEN`, `BRAVE_API_KEY`, `MCP_FS_ROOT`.
2. Restart Cursor / Claude Desktop.
3. Confirm servers appear: postgres, github, filesystem, brave-search, memory.

## Customize

- Edit `AGENTS.md` for team-wide conventions (single source of truth).
- Keep `.cursor/rules/*.mdc` short and glob-scoped.
- Keep `.claude/CLAUDE.md` for commands, key files, and env vars.
- Mix MCP servers using `configs/python/mcp/snippets/`.
