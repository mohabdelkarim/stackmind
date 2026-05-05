# stackmind

Copy-paste configuration kits for AI coding tools (Cursor, Claude Code, Copilot, Gemini, Windsurf, and friends) organized by tech stack.

[![Auto-Update](https://github.com/mohabdelkarim/stackmind/actions/workflows/ai-updater.yml/badge.svg)](https://github.com/mohabdelkarim/stackmind/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mohabdelkarim/stackmind.svg?style=social)](https://github.com/mohabdelkarim/stackmind/stargazers)

## What is this?

Modern AI coding tools need **project-aware configuration**: Cursor rules, CLAUDE.md manuals, AGENTS.md behavior profiles, and MCP server configs that understand your stack.
Setting these up from scratch for every new project is repetitive, fragile, and easy to get wrong.

stackmind is a curated set of **copy-paste kits** for common stacks (Next.js, Python/FastAPI, and more), all following the same structure and quality bar.
Each kit includes editor rules, agent guidance, MCP definitions, and a setup guide that you can drop straight into a real project.

A daily GitHub Actions workflow uses the **Cerebras `llama-3.3-70b` model** to keep MCP server versions and related tooling up to date.
It checks `meta/versions.json`, proposes version changes, validates JSON configs, and writes a small changelog entry so you can track what changed.

## Files at a glance

| File / Path                                | Tool / Concept         | Works with                                      | What it does |
| ------------------------------------------ | ---------------------- | ----------------------------------------------- | ------------ |
| `configs/{stack}/.cursorrules`            | Cursor rules           | Cursor                                          | High-level editing rules, project layout, and conventions for a stack. |
| `configs/{stack}/.cursor/rules/*.mdc`     | Cursor stack rules     | Cursor                                          | Stack-scoped rules with file globs and behaviors for specific folders. |
| `configs/{stack}/.claude/CLAUDE.md`       | Claude project manual  | Claude Code (Desktop, VS Code)                  | Describes stack conventions, key files, commands, and environment variables. |
| `configs/{stack}/AGENTS.md`               | Agent roles & behavior | Claude, Cursor, Copilot, Gemini, Windsurf, etc. | Defines roles (architect, backend, testing, reviewer) and global quality rules. |
| `configs/{stack}/mcp/mcp-config.json`     | MCP server config      | Claude Desktop, Cursor, other MCP clients       | Declares MCP servers (Postgres, GitHub, filesystem, Brave Search, memory). |
| `configs/{stack}/mcp/README.md`           | MCP docs               | Any MCP client                                  | Documents what each MCP server does and how to configure credentials. |
| `configs/{stack}/SETUP-GUIDE.md`          | Setup guide            | Any editor / CI                                 | Step-by-step instructions to apply the kit to a real project and verify it. |
| `meta/versions.json`                      | Version registry       | GitHub Actions                                  | Tracks pinned MCP server versions and core tool versions used by kits. |

## Available stacks

| Stack  | Tech                                      | Status            |
| ------ | ----------------------------------------- | ----------------- |
| Next.js | Next.js 15, TypeScript, MCP servers      | Kit in progress   |
| Python | Python 3.12+, FastAPI, SQLAlchemy, MCP    | Complete kit      |
| More   | Your favorite stack                       | More coming soon — open an issue to request a stack. |

## Quick start (2 min)

Pick a stack (Next.js or Python/FastAPI) and copy its config kit into your project.

```bash
# 1. Clone the repo
git clone https://github.com/mohabdelkarim/stackmind.git
cd stackmind

# 2. Copy a stack kit into your project (example: Python/FastAPI)
cp -R configs/python/ /path/to/your-fastapi-app/.stackmind-python/

# 3. Apply the core files
cp configs/python/AGENTS.md /path/to/your-fastapi-app/
cp -R configs/python/.claude /path/to/your-fastapi-app/
cp configs/python/.cursorrules /path/to/your-fastapi-app/

# 4. Configure MCP
cp -R configs/python/mcp ~/.mcp/stackmind-python/

# 5. Run validation inside this repo
npm ci
npm run validate
```

Adapt the paths as needed for your own project layout and chosen stack.

## Auto-updates

A scheduled GitHub Actions workflow (`.github/workflows/ai-updater.yml`) runs every day at 07:00 UTC.
It uses the Cerebras Cloud SDK and the `llama-3.3-70b` model to compare `meta/versions.json` against the npm registry, update MCP config files, validate all JSON, and append an `[auto]` changelog entry.
If validation fails, the workflow opens a GitHub issue so humans can review the changes before merging.

## Adding a new stack

To add a new stack (for example Rails, Deno, or Remix), follow the guidelines in **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
