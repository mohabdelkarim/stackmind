# Next.js MCP servers

Pinned MCP servers for the Next.js kit. Versions live in `meta/versions.json` and are rewritten by `npm run update`.

Configs target **Cursor** `.cursor/mcp.json` interpolation:

- `${env:NAME}` for secrets (never commit real values)
- `${workspaceFolder}` for the project root allow-list on filesystem

## Default servers (`init`)

| Server | Package | How it is wired |
|--------|---------|-----------------|
| brave-search | `@modelcontextprotocol/server-brave-search` | `env.BRAVE_API_KEY` = `${env:BRAVE_API_KEY}` |
| github | `@modelcontextprotocol/server-github` | `env.GITHUB_PERSONAL_ACCESS_TOKEN` = `${env:GITHUB_PERSONAL_ACCESS_TOKEN}` |
| postgres | `@modelcontextprotocol/server-postgres` | DSN as **CLI arg** `${env:DATABASE_URL}` (this server does not read a DSN env key) |
| filesystem | `@modelcontextprotocol/server-filesystem` | Allowed dir as **CLI arg** `${workspaceFolder}` |
| notion | `@notionhq/notion-mcp-server` | `env.NOTION_TOKEN` = `${env:NOTION_TOKEN}` (local server; Notion also has a remote MCP) |
| memory | `@modelcontextprotocol/server-memory` | no secrets |

## Optional snippets

Copy from `snippets/` into `.cursor/mcp.json` only when needed:

| Server | Package | Env |
|--------|---------|-----|
| stripe | `@stripe/mcp` | `STRIPE_SECRET_KEY` (prefer restricted **test** keys) |
| supabase | `@supabase/mcp-server-supabase` | `SUPABASE_ACCESS_TOKEN` (or use hosted `https://mcp.supabase.com/mcp`) |

## Install

`stackmind init nextjs` merges defaults into `.cursor/mcp.json` and writes `stackmind.mcp.json`.

## Security

- Never commit API keys, PATs, or connection strings.
- Set OS / shell env vars, then restart Cursor so `${env:…}` resolves.
- Prefer read-only / restricted credentials for agent tools.
