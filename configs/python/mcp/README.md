# MCP Servers for Python/FastAPI

This directory contains Model Context Protocol (MCP) server definitions tailored for the Python/FastAPI stack.
Each server can be used by Claude Desktop, Cursor, or other MCP-aware tools to operate on your FastAPI project.

## Postgres Server (postgres)
- What it does: provides async access to your PostgreSQL database for querying schemas and data.
- When to use it: inspecting tables, debugging queries, or generating migrations-aware code.
- Credentials: set POSTGRES_DSN to an asyncpg DSN (e.g. postgresql+asyncpg://user:pass@host/db).
- How to get it: provision a PostgreSQL instance (e.g. on Supabase, Render, Railway) and copy the connection string.
- Placeholder to replace: POSTGRES_DSN in mcp-config.json and postgres snippet.

## GitHub Server (github)
- What it does: lets tools read and manage issues, PRs, and code in your GitHub repo.
- When to use it: reviewing PRs, linking tasks to issues, or searching code history.
- Credentials: set GITHUB_TOKEN to a fine-grained personal access token.
- How to get it: generate a token at https://github.com/settings/personal-access-tokens.
- Placeholder to replace: GITHUB_TOKEN in mcp-config.json and github snippet.

## Filesystem Server (filesystem)
- What it does: exposes your local FastAPI project directory over MCP.
- When to use it: navigating files, applying refactors, or editing code via MCP clients.
- Credentials: set MCP_FS_ROOT to the absolute path of your project root.
- How to get it: use your local filesystem path (e.g. /Users/you/projects/stackmind-fastapi).
- Placeholder to replace: MCP_FS_ROOT in mcp-config.json and filesystem snippet.

## Brave Search Server (brave-search)
- What it does: performs privacy-respecting web searches via Brave Search.
- When to use it: researching APIs, libraries, or troubleshooting FastAPI/PostgreSQL issues.
- Credentials: set BRAVE_API_KEY to your Brave Search API key.
- How to get it: create an application and key at https://api.search.brave.com/app.
- Placeholder to replace: BRAVE_API_KEY in mcp-config.json and brave-search snippet.

## Memory Server (memory)
- What it does: stores long-lived, vectorized context about your FastAPI project.
- When to use it: teaching the agent about domain concepts, architectural decisions, and recurring patterns.
- Credentials: none required by default; configure according to the server's documentation if needed.
- Placeholders: no env vars are required in the default setup.
