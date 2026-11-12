# Python / FastAPI MCP servers

Pinned MCP servers for the FastAPI kit. Versions live in `meta/versions.json`.

Configs target **Cursor** `.cursor/mcp.json` interpolation (`${env:NAME}`, `${workspaceFolder}`).

## Servers

| Server | Package | How it is wired |
|--------|---------|-----------------|
| postgres | `@modelcontextprotocol/server-postgres` | DSN as **CLI arg** `${env:DATABASE_URL}` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | allowed dir `${workspaceFolder}` |
| brave-search | `@modelcontextprotocol/server-brave-search` | `BRAVE_API_KEY` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

## Install

`stackmind init python` merges these into `.cursor/mcp.json` and writes `stackmind.mcp.json`.

Mix-and-match from `snippets/` when needed.

## API keys

- Brave: https://brave.com/search/api/
- GitHub: PAT with the scopes you need (`GITHUB_PERSONAL_ACCESS_TOKEN`)
- Postgres: set `DATABASE_URL` in the environment Cursor inherits

Never commit real keys.
