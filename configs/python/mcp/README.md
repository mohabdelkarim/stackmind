# Python / FastAPI MCP servers

Pinned MCP servers for the FastAPI kit. Versions are tracked in `meta/versions.json` and updated by `npm run update`.

## Servers

| Server | Package | Env |
|--------|---------|-----|
| postgres | `@modelcontextprotocol/server-postgres` | `POSTGRES_DSN` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `MCP_FS_ROOT` |
| brave-search | `@modelcontextprotocol/server-brave-search` | `BRAVE_API_KEY` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

## Install

`stackmind init python` merges these into `.cursor/mcp.json` and writes `stackmind.mcp.json`.

For mix-and-match, copy individual files from `snippets/`.

## API keys

- Brave: https://brave.com/search/api/
- GitHub: classic or fine-grained PAT with repo scope as needed

Never commit real keys. Use local env or your MCP client secret store.
