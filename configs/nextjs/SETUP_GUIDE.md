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

Useful flags: `--force`, `--dry-run`, `--no-mcp`, `--mcp-only`.

## What gets written

| Source | Destination |
|--------|-------------|
| `AGENTS.md` | project root (canonical rules for all agents) |
| `.claude/CLAUDE.md` | Claude Code project manual |
| `.cursor/rules/nextjs.mdc` | Cursor glob-scoped overlay |
| `mcp/mcp_config.json` | `.cursor/mcp.json` (merged) + `stackmind.mcp.json` |

Legacy `.cursorrules` is not installed. Prefer `AGENTS.md` + `.cursor/rules/`.

## Verify Cursor

1. Restart Cursor.
2. Ask it to scaffold `app/(auth)/login/page.tsx`.
3. Expect strict TypeScript, Server Components by default, and structure from `AGENTS.md`.

## Verify Claude Code

1. Confirm `.claude/CLAUDE.md` is present.
2. Ask: "How should I structure a new feature in this Next.js app?"
3. Expect mentions of Server Components, Zod, Prisma, and NextAuth.

## Verify MCP

1. Set env vars as needed: `DATABASE_URL`, `GITHUB_TOKEN`, `BRAVE_API_KEY`, `MCP_FS_ROOT`, `NOTION_TOKEN`.
2. Restart Cursor / Claude Desktop.
3. Confirm servers appear: postgres, github, filesystem, brave-search, notion, memory.

## Customize

- Edit `AGENTS.md` for team-wide conventions (single source of truth).
- Keep `.cursor/rules/*.mdc` short and glob-scoped.
- Keep `.claude/CLAUDE.md` for commands, key files, and env vars.
- Mix MCP servers using `configs/nextjs/mcp/snippets/`.
