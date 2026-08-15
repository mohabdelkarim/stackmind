# Next.js MCP servers

Pinned MCP servers for the Next.js kit. Versions are tracked in `meta/versions.json` and updated by `npm run update`.

## Servers

| Server | Package | Env |
|--------|---------|-----|
| brave-search | `@modelcontextprotocol/server-brave-search` | `BRAVE_API_KEY` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| postgres | `@modelcontextprotocol/server-postgres` | `DATABASE_URL` / `POSTGRES_DSN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `MCP_FS_ROOT` |
| notion | `@notionhq/notion-mcp-server` | `NOTION_TOKEN` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

## Install

`stackmind init nextjs` merges these into `.cursor/mcp.json` and writes `stackmind.mcp.json`.

For mix-and-match, copy individual files from `snippets/`.

## API keys

- Brave: https://brave.com/search/api/
- GitHub: classic or fine-grained PAT with repo scope as needed
- Notion: internal integration token from Notion developers settings

Never commit real keys. Use local env or your MCP client secret store.
