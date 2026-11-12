# NestJS MCP servers

Default servers installed by `stackmind init nestjs`. Cursor interpolation: `${env:NAME}`, `${workspaceFolder}`.

| Server | Package | How it is wired |
|--------|---------|-----------------|
| postgres | `@modelcontextprotocol/server-postgres` | DSN CLI arg `${env:DATABASE_URL}` |
| github | `@modelcontextprotocol/server-github` | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `${workspaceFolder}` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

Never commit real secrets.
