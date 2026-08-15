# stackmind

Install production ready AI coding configs for Cursor, Claude Code, Copilot, Gemini, and other agents.

One command drops in `AGENTS.md`, Claude manuals, Cursor rules, and pinned MCP servers for **Next.js** or **Python FastAPI**. MCP package versions stay current through a deterministic daily updater.

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1?style=flat-square)](./LICENSE)
[![Node >=22](https://img.shields.io/badge/Node.js-%3E%3D22-22c55e?style=flat-square)](https://nodejs.org)

## Why this exists

Every AI coding tool needs project context. Copying rules by hand drifts. MCP pins go stale. **stackmind** is a small CLI plus curated kits so new projects start agent ready.

## Quick start

```bash
npx github:mohabdelkarim/stackmind init nextjs
# or
npx github:mohabdelkarim/stackmind init python
```

```bash
git clone https://github.com/mohabdelkarim/stackmind.git
cd stackmind
npm ci
node bin/stackmind.js init nextjs ~/your_project
npm run validate
```

Full verification: `configs/nextjs/SETUP_GUIDE.md` or `configs/python/SETUP_GUIDE.md`.

## Kits

| Stack | Path | Includes |
|-------|------|----------|
| Next.js 15 | `configs/nextjs/` | App Router, TypeScript, Tailwind, Prisma, NextAuth |
| Python FastAPI | `configs/python/` | FastAPI, async SQLAlchemy, Pydantic v2, Alembic |

What `init` writes:

| File | Role |
|------|------|
| `AGENTS.md` | Canonical rules for all agents |
| `.claude/CLAUDE.md` | Claude Code commands, key files, env vars |
| `.cursor/rules/*.mdc` | Cursor glob scoped overlays |
| `.cursor/mcp.json` | Merged MCP servers with pinned versions |
| `stackmind.mcp.json` | Portable MCP copy for other clients |

## CLI

```bash
stackmind list
stackmind init <stack> [targetDir] [--force] [--dry-run] [--no-mcp] [--mcp-only]
```

## Auto updater

Daily at **07:00 UTC**, GitHub Actions:

1. Checks npm for newer MCP package versions in `meta/versions.json`
2. Pins versions across `configs/*/mcp/` with a deterministic script
3. Validates JSON
4. Commits under `MOHAbdelkarim <mohaabdelkarim2@gmail.com>`

No third party AI API key required.

```bash
npm run check
npm run update
npm run validate
npm run examples
```

## Examples

- `examples/nextjs_applied/`
- `examples/python_applied/`

Regenerate with `npm run examples`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Keep MCP versions pinned. Do not commit secrets.

## License

MIT © MOHAbdelkarim
