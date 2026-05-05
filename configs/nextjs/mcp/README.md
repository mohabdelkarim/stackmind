# Next.js MCP configuration

This directory contains Model Context Protocol (MCP) server definitions used by the Next.js stackmind starter kit.

Each entry in `mcp-config.json` describes how a client (such as Claude Code, Cursor, or other MCP-aware tools) can launch and connect to a given MCP server.

## Included servers

- Postgres: `@modelcontextprotocol/server-postgres@0.6.2` for database access and schema-aware tooling.
- GitHub: `@modelcontextprotocol/server-github@2025.4.8` for repository, issues, and PR workflows.
- Filesystem: `@modelcontextprotocol/server-filesystem@2025.1.14` for safe local project navigation.
- Brave Search: `@modelcontextprotocol/server-brave-search@0.6.2` for web search; version is explicitly pinned to avoid breaking changes.
- Notion: `@notionhq/notion-mcp-server@1.3.2` for workspace documents and knowledge bases.
- Memory: `@modelcontextprotocol/server-memory@0.6.3` for long-lived, vectorized project memory.

## Environment variables

- `BRAVE_API_KEY`: API key for Brave Search (required by the Brave MCP server).
- Additional secrets (for GitHub, Postgres, Notion, etc.) should be provided via your local environment or `.env` file but must **never** be committed. Use `.env.example` as a reference.

These notes replace any inline `_comment` fields that might otherwise be embedded in the JSON; comments are intentionally kept here to ensure the JSON configs remain valid MCP spec.
