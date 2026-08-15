# stackmind

Free, MIT licensed AI coding configs for Cursor, Claude Code, Copilot, Gemini, and other agents.

Install stack aware `AGENTS.md`, Claude manuals, Cursor rules, and pinned MCP servers in about two minutes. No paid tiers.

## Who it is for

Developers who start new projects often and do not want to re teach the agent the stack, conventions, and tool wiring every time.

## What you get

| Stack | Command |
|-------|---------|
| Next.js 15 (App Router, TypeScript, Prisma, NextAuth) | `init nextjs` |
| Python FastAPI (async SQLAlchemy, Pydantic v2, Alembic) | `init python` |

Each install writes:

- `AGENTS.md` (canonical rules for all agents)
- `.claude/CLAUDE.md` (commands, key files, env vars)
- `.cursor/rules/*.mdc` (Cursor glob scoped overlays)
- `.cursor/mcp.json` (merged MCP servers) and `stackmind.mcp.json`

## Two minute setup

```bash
# In your project root
npx github:mohabdelkarim/stackmind init nextjs
# or
npx github:mohabdelkarim/stackmind init python
```

```bash
# From a clone
git clone https://github.com/mohabdelkarim/stackmind.git
cd stackmind
npm ci
node bin/stackmind.js doctor
node bin/stackmind.js init nextjs ~/your_project
npm run validate
```

Restart Cursor or Claude Code after install.

### Quick verification

Ask the agent:

- Next.js: "What stack and folder conventions does this project use?"
- FastAPI: "Where should business logic live, and how do we run migrations?"

Expect answers that match `AGENTS.md` and `.claude/CLAUDE.md`.

Full steps: [configs/nextjs/SETUP_GUIDE.md](configs/nextjs/SETUP_GUIDE.md) or [configs/python/SETUP_GUIDE.md](configs/python/SETUP_GUIDE.md).

## CLI

```bash
stackmind list
stackmind doctor [targetDir]
stackmind init <stack> [targetDir] [--force] [--dry-run] [--no-mcp] [--mcp-only]
```

## Proof

Reproducible install checks and before/after notes: [docs/DEMO.md](docs/DEMO.md)

```bash
npm run demo_proof
```

Applied outputs (reference): [examples/](examples/)

## MCP

Pinned servers live under each kit's `mcp/` folder. Versions are tracked in [meta/versions.json](meta/versions.json) and updated by a deterministic daily GitHub Action (no LLM rewriting configs). You supply your own API keys via env vars. Never commit secrets.

Optional snippets (Stripe, Supabase, Notion, and others) are in `configs/*/mcp/snippets/`.

## Automation

Daily at 07:00 UTC the workflow checks npm for newer MCP pins, updates JSON configs, validates, and commits as `MOHAbdelkarim <mohaabdelkarim2@gmail.com>`. Failures open a GitHub issue.

```bash
npm run check
npm run update
npm run validate
```

## Non goals

- Not a paid Gumroad pack
- Not a full app scaffold (no generated Next.js/FastAPI app code)
- Not a substitute for reading your own product requirements
- Legacy `.cursorrules` is not installed; use `AGENTS.md` + `.cursor/rules/`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ADDING_A_STACK.md](docs/ADDING_A_STACK.md). New stacks stay free and public.

Soft launch notes: [docs/LAUNCH.md](docs/LAUNCH.md)

## License

MIT © MOHAbdelkarim
