# Contributing to stackmind

Thanks for improving **stackmind**. The goal is small, practical config kits that install cleanly into real projects.

## How you can help

- Add a new stack kit
- Improve existing Next.js or Python kits
- Fix the CLI, updater scripts, or workflows
- Clarify docs

## Adding a new stack kit

1. Create `configs/<stack>/`.
2. Add at least:
   - `AGENTS.md` (canonical source of truth)
   - `.cursor/rules/<stack>.mdc` (short, glob-scoped Cursor overlay)
   - `.claude/CLAUDE.md` (commands, key files, env vars)
   - `mcp/mcp_config.json`
   - `mcp/snippets/*.json`
   - `mcp/README.md`
   - `SETUP_GUIDE.md`
3. Register the stack in `bin/stackmind.js` (`STACKS` map).
4. If you add MCP packages, pin them in `meta/versions.json`.
5. Open a PR titled like `feat(<stack>): add <stack> kit` with a short test note.

Do **not** add legacy `.cursorrules`. Prefer `AGENTS.md` plus scoped `.mdc` files.
Do **not** use hyphen characters in new filenames or workflow names. Prefer underscores.

## Style and safety

- JSON must parse cleanly. No comments, no `_comment` keys.
- MCP package versions must be pinned (`@scope/name@version`).
- Never commit API keys, tokens, or real `.env` files.

## Commits and PRs

- Prefer Conventional Commits: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`.
- Keep each commit focused.
- Before opening a PR:
  - [ ] `npm run validate` passes
  - [ ] Versions are pinned and listed in `meta/versions.json` where needed
  - [ ] No secrets are present
  - [ ] README or stack docs are updated if behaviour changed
  - [ ] CHANGELOG entry for user-visible changes
