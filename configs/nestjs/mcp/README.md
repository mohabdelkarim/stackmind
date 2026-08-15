# NestJS MCP servers

Default servers installed by `stackmind init nestjs`.

| Server | Package | Env |
|--------|---------|-----|
| postgres | `@modelcontextprotocol/server-postgres` | `DATABASE_URL` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `MCP_FS_ROOT` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

Never commit real secrets.
