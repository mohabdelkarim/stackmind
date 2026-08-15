# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2026-08-15

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
