# stackmind

Free, MIT licensed AI coding configs for Cursor, Claude Code, Copilot, Gemini, and other agents.

Install stack aware `AGENTS.md`, Claude manuals, Cursor rules, and pinned MCP servers in about two minutes. No paid tiers.

## Who it is for

Developers who start new projects often and do not want to re teach the agent the stack, conventions, and tool wiring every time.

## What you get

| Stack | Command |
|-------|---------|
| Next.js 15 | `init nextjs` |
| Python FastAPI | `init python` |
| NestJS | `init nestjs` |
| Vue / Nuxt 3 | `init vue_nuxt` |

Each install writes:

- `AGENTS.md` (canonical rules for all agents)
- `.claude/CLAUDE.md` (commands, key files, env vars)
- `.cursor/rules/*.mdc` (Cursor glob scoped overlays)
- `.cursor/mcp.json` (merged MCP servers) and `stackmind.mcp.json`

## Two minute setup

```bash
npx github:mohabdelkarim/stackmind init nextjs
# or: python | nestjs | vue_nuxt
```

```bash
git clone https://github.com/mohabdelkarim/stackmind.git
cd stackmind
npm ci
node bin/stackmind.js doctor
node bin/stackmind.js init nextjs ~/your_project
npm run validate
npm run demo_proof
```

Restart Cursor or Claude Code after install.

## Live sample apps (battle tested)

| Sample | What it proves |
|--------|----------------|
| [examples/nextjs_live](examples/nextjs_live) | Real App Router app + Zod `lib/env.ts` + health API + kit |
| [examples/python_live](examples/python_live) | Real FastAPI app + pytest health test + kit |
| [examples/nestjs_live](examples/nestjs_live) | Nest feature module shape + kit smoke |
| [examples/vue_nuxt_live](examples/vue_nuxt_live) | Nuxt pages/server API shape + kit smoke |

## Proof and demo

- Walkthrough: [docs/DEMO.md](docs/DEMO.md)
- Visual demo page (open locally or screen record): [docs/demo.html](docs/demo.html)
- Latest automated proof log: [docs/PROOF_LOG.md](docs/PROOF_LOG.md)

```bash
npm run demo_proof
npm run live_smoke
```

## CLI

```bash
stackmind list
stackmind doctor [targetDir]
stackmind init <stack> [targetDir] [--force] [--dry-run] [--no-mcp] [--mcp-only]
```

## MCP

Pinned servers under each kit's `mcp/`. Versions in [meta/versions.json](meta/versions.json). Deterministic weekday updater (Mon-Fri). You supply API keys. Never commit secrets.

## Automation

Weekdays at 07:00 UTC (no weekend runs): check npm pins, update MCP JSON, validate, commit as `MOHAbdelkarim <mohaabdelkarim2@gmail.com>`.

## Non goals

- Not a paid product
- Not a replacement for your product requirements
- Kits configure agents; live samples under `examples/*_live` show real usage
- Legacy `.cursorrules` is not installed

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ADDING_A_STACK.md](docs/ADDING_A_STACK.md).

## License

MIT © MOHAbdelkarim
