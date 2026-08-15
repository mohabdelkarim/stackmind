# Next.js MCP servers

Pinned MCP servers for the Next.js kit. Versions are tracked in `meta/versions.json` and updated by `npm run update`.

## Default servers (installed by `init`)

| Server | Package | Env |
|--------|---------|-----|
| brave-search | `@modelcontextprotocol/server-brave-search` | `BRAVE_API_KEY` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| postgres | `@modelcontextprotocol/server-postgres` | `DATABASE_URL` / `POSTGRES_DSN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `MCP_FS_ROOT` |
| notion | `@notionhq/notion-mcp-server` | `NOTION_TOKEN` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

## Optional snippets

Copy from `snippets/` into your MCP config when needed:

| Server | Package | Env |
|--------|---------|-----|
| stripe | `@stripe/mcp` | `STRIPE_SECRET_KEY` |
| supabase | `@supabase/mcp-server-supabase` | `SUPABASE_URL`, `SUPABASE_ACCESS_TOKEN` |

## Install

`stackmind init nextjs` merges defaults into `.cursor/mcp.json` and writes `stackmind.mcp.json`.

## API keys

You provide keys. Never commit them.

- Brave: https://brave.com/search/api/
- GitHub: PAT with the scopes you need
- Notion: internal integration token
- Stripe / Supabase: from their dashboards
