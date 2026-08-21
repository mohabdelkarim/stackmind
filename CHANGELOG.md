# Changelog

[auto] - 2026-08-21
Updated
- @supabase/mcp-server-supabase: 0.10.0 -> 0.11.0

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-08-15

### Added
- CI workflow: validate, doctor, cli_smoke, eval, demo_proof, live_smoke
- `meta/kit_schema.json` and kit.json schema checks in `npm run validate`
- `stackmind upgrade` (keeps local edits unless `--force`)
- `stackmind init --diff` / `upgrade --diff`
- Deterministic eval harness under `evals/`
- Scoped Cursor rules: api, db, security, tests (per stack depth)
- `recipes/` installed to `stackmind_recipes/` on init
- `npm run cli_smoke`, `npm run eval`, `npm test`, npm publish packaging (`publishConfig`)

### Changed
- Next.js and Python `AGENTS.md` anti-pattern blocks
- Version bump to 1.4.0

## [1.3.0] - 2026-08-15

### Added
- NestJS and Vue/Nuxt free kits
- Live sample apps: `examples/nextjs_live`, `examples/python_live`, `examples/nestjs_live`, `examples/vue_nuxt_live`
- `docs/demo.html` visual demo page
- `npm run live_smoke` for real app smoke/build/pytest
- Automated proof log `docs/PROOF_LOG.md`

### Changed
- Next.js and Python `AGENTS.md` updated from live sample learnings

## [1.2.0] - 2026-08-15

### Added
- `stackmind doctor` health checks
- Per kit `kit.json` discovery for the CLI
- Optional Stripe and Supabase MCP snippets (Next.js)
- `docs/DEMO.md`, `docs/LAUNCH.md`, `docs/ADDING_A_STACK.md`
- `npm run demo_proof` automated install proof

### Changed
- README rewritten as a calm free MIT product page
- Slimmer `CLAUDE.md` files for Next.js and FastAPI
- CONTRIBUTING updated for free only growth and kit.json


### Changed
- Renamed `SETUP_GUIDE.md` and `mcp_config.json` (no hyphen filenames)
- Canonical LICENSE and `.mailmap` under MOHAbdelkarim only
- README focused on discoverability (Cursor, AGENTS.md, MCP, FastAPI, Next.js)

### Removed
- Non canonical contributor identities from publish path (history squash to MOHAbdelkarim)


### Added
- CLI: `stackmind init <stack>` and `stackmind list`
- Canonical `AGENTS.md` as the single source of truth per kit
- Deterministic MCP version updater (no LLM / no API key)
- Applied examples under `examples/nextjs_applied` and `examples/python_applied`
- Next.js MCP snippet pack aligned with Python

### Changed
- Cursor overlays are short glob-scoped `.mdc` files that defer to `AGENTS.md`
- Removed legacy `.cursorrules` from install path
- Workflow renamed to MCP Config Auto Updater
- Dropped Cerebras dependency from automation

### Fixed
- Synced MCP config pins with `meta/versions.json` (filesystem, memory, notion drift)

## Prior auto updates

[auto] - 2026-07-26
Updated
- @notionhq/notion-mcp-server: 2.5.0 -> 2.5.1

[auto] - 2026-07-25
Updated
- @notionhq/notion-mcp-server: 2.4.1 -> 2.5.0

[auto] - 2026-07-10
Updated
- @modelcontextprotocol/server-filesystem: 2026.7.4 -> 2026.7.10

[auto] - 2026-07-05
Updated
- @modelcontextprotocol/server-filesystem: 2026.1.14 -> 2026.7.4
- @modelcontextprotocol/server-memory: 2026.1.26 -> 2026.7.4

[auto] - 2026-06-23
Updated
- @notionhq/notion-mcp-server: 2.4.0 -> 2.4.1

[auto] - 2026-06-18
Updated
- @notionhq/notion-mcp-server: 2.2.1 -> 2.4.0

[auto] - 2026-05-05
Updated
- @modelcontextprotocol/server-filesystem: 2025.1.14 -> 2026.1.14
- @notionhq/notion-mcp-server: 1.3.2 -> 2.2.1
- @modelcontextprotocol/server-memory: 0.6.3 -> 2026.1.26

## [1.0.0] - 2026-05-05

### Added
- Initial release with Next.js 15 and Python/FastAPI configuration kits
- Cursor rules (`.cursorrules` + `.mdc` format)
- `CLAUDE.md` templates for Claude Code
- `AGENTS.md` universal agent configuration
- MCP config snippets for Postgres, GitHub, Filesystem, Brave Search, Notion, Memory
- Automated daily update system via GitHub Actions
