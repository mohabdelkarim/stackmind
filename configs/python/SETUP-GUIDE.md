# Python/FastAPI Stackmind Setup Guide

This guide configures the Python/FastAPI configuration kit so AI coding tools work consistently across your project.

## Prerequisites
- Python 3.12+ installed and available on PATH.
- FastAPI-compatible environment (uv, pip, or poetry) and PostgreSQL instance.
- Node.js installed if you plan to run MCP servers via npx.
- Docker installed if you use containerized development.

## Step 1 – Apply Cursor Rules
- Copy configs/python/.cursorrules into the root of your FastAPI project (or merge with existing rules).
- Ensure the project structure matches app/api, app/models, app/schemas, app/services, app/core, and alembic.
- Restart Cursor so it picks up the updated rules.

Verification:
- Ask Cursor to scaffold a new FastAPI endpoint.
- It should show file paths under app/api/ and suggest async code with type hints.

## Step 2 – Configure Claude Code (CLAUDE.md)
- Copy configs/python/.claude/CLAUDE.md into .claude/CLAUDE.md in your project.
- Review the conventions and update any project-specific details if needed.
- Commit the file so collaborators share the same expectations.

Verification:
- In Claude Code, ask "How should I structure a new feature?".
- The answer should reference FastAPI, async SQLAlchemy, Pydantic v2, and the documented key files.

## Step 3 – Apply AGENTS.md
- Copy configs/python/AGENTS.md into the root of your repo.
- Customize responsibilities per team if necessary but keep the roles consistent.
- Use this file as the single source of truth for agent behavior.

Verification:
- Ask your AI assistant to act as [backend] or [database].
- It should respond with behavior aligned to the documented responsibilities.

## Step 4 – Configure MCP for Claude Desktop and Cursor
- Copy configs/python/mcp/mcp-config.json into your MCP config location (e.g. ~/.mcp/ or project-level).
- Optionally, copy individual snippets from configs/python/mcp/snippets/ into your tool-specific snippet directory.
- Set environment variables: POSTGRES_DSN, GITHUB_TOKEN, MCP_FS_ROOT, BRAVE_API_KEY.

Verification:
- From Claude Desktop or Cursor, list available MCP servers.
- Confirm that postgres, github, filesystem, brave-search, and memory appear and can be pinged.

## Important Notes
- Never commit real secrets; only commit .env.example and documentation.
- Keep DATABASE_URL and POSTGRES_DSN consistent between your app/core/config.py and MCP config.
- Align your Docker and CI configuration with the same environment variables.
- Pin MCP server versions as provided to avoid breaking changes.

## Customization Tips
- Extend AGENTS.md with additional roles (e.g. [frontend], [ops]) if your project needs them.
- Add project-specific MCP servers (e.g. Redis, Notion) following the patterns in configs/nextjs/mcp.
- Tune .cursorrules to encourage or discourage specific libraries while keeping the core conventions.
- Update CLAUDE.md when you introduce new critical workflows, such as background workers or internal CLIs.
