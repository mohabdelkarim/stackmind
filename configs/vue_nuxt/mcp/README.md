# Vue / Nuxt MCP servers

Default servers installed by `stackmind init vue_nuxt`. Cursor interpolation: `${env:NAME}`, `${workspaceFolder}`.

| Server | Package | How it is wired |
|--------|---------|-----------------|
| github | `@modelcontextprotocol/server-github` | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| filesystem | `@modelcontextprotocol/server-filesystem` | `${workspaceFolder}` |
| memory | `@modelcontextprotocol/server-memory` | (none) |

Never commit real secrets.
