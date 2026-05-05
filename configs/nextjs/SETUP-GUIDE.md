# Next.js 15 Stackmind Setup Guide

This guide explains how to apply the Next.js 15 configuration kit to your project so AI coding tools behave consistently.

## Prerequisites

- Node.js 18+ installed (Node 22+ recommended for running the automation scripts).
- A PostgreSQL database accessible from your development environment.
- A working installation of Cursor or Claude Code (VS Code or Desktop).

## Step 1 — Cursor rules

1. Copy `configs/nextjs/.cursorrules` into the root of your Next.js project.
2. Copy `configs/nextjs/.cursor/rules/nextjs.mdc` into your project's `.cursor/rules/` directory.
3. Restart Cursor so it picks up the new rules.

Verification:
- Ask Cursor to scaffold a new route in `app/(auth)/login/page.tsx`.
- It should use strict TypeScript, React Server Components by default, and reference the documented project structure.

## Step 2 — CLAUDE.md

1. Copy `configs/nextjs/.claude/CLAUDE.md` into `.claude/CLAUDE.md` in your Next.js project.
2. Commit the file so all collaborators share the same expectations.

Verification:
- In Claude Code, ask: "How should I structure a new feature in this Next.js app?".
- The answer should mention Server Components, Zod validation, Prisma, and NextAuth.

## Step 3 — AGENTS.md

1. Copy `configs/nextjs/AGENTS.md` into the root of your repository.
2. Use the documented roles in your prompts (e.g. "Act as [architect]" or "Act as [backend]").

Verification:
- Ask your agent to act as [reviewer].
- It should focus on TypeScript strictness, secrets, Zod usage, and accessibility.

## Step 4 — MCP configuration

1. Copy `configs/nextjs/mcp/mcp-config.json` into your MCP configuration directory (for example `~/.mcp/stackmind-nextjs/`).
2. Set the following environment variables in your shell or MCP client:
   - `DATABASE_URL`
   - `GITHUB_TOKEN`
   - `BRAVE_API_KEY`
   - `MCP_FS_ROOT`
3. Restart Claude Desktop or Cursor and ensure the MCP servers appear.

Verification:
- From an MCP-aware client, list available MCP servers.
- You should see postgres, github, filesystem, brave-search, and memory.

## Important Notes

- Never commit real secrets; keep `DATABASE_URL`, `NEXTAUTH_SECRET`, and other secrets in `.env.local` or your deployment platform.
- Ensure `DATABASE_URL` matches the provider configuration in `prisma/schema.prisma`.
- Keep MCP versions pinned as provided in `meta/versions.json` to avoid unexpected breaking changes.

## Customization Tips

- Extend `AGENTS.md` with additional roles such as [ops] or [design] for your team.
- Add more MCP servers (e.g. Redis, Notion) by following the patterns in the existing MCP configs.
- Tune `.cursorrules` to highlight project-specific patterns (e.g. design system components or internal libraries).
- Update `CLAUDE.md` when you introduce new workflows like background jobs or custom CLIs.
