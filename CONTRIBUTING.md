# Contributing to stackmind

Thanks for improving **stackmind**. It is a free MIT toolkit. Small, practical kits that install cleanly into real projects.

## How you can help

- Add a new free stack kit (see [docs/ADDING_A_STACK.md](docs/ADDING_A_STACK.md))
- Improve existing Next.js or Python kits
- Fix the CLI, updater scripts, or workflows
- Clarify docs

## Adding a new stack kit

1. Create `configs/<stack>/` with `kit.json` and the standard files listed in ADDING_A_STACK.
2. Pin new MCP packages in `meta/versions.json`.
3. Run `node bin/stackmind.js doctor` and `npm run validate`.
4. Open a PR titled like `feat(<stack>): add <stack> kit` with a short test note.

Do **not** add legacy `.cursorrules`. Prefer `AGENTS.md` plus scoped `.mdc` files.
Do **not** use hyphen characters in new filenames or workflow names. Prefer underscores.
Do **not** introduce paid packaging. Everything stays public and free.

## Style and safety

- JSON must parse cleanly. No comments, no `_comment` keys.
- MCP package versions must be pinned (`@scope/name@version`).
- Never commit API keys, tokens, or real `.env` files.
- Commits must use `MOHAbdelkarim <mohaabdelkarim2@gmail.com>` only. No bot or AI co-authors.

## Commits and PRs

- Prefer Conventional Commits: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`.
- Keep each commit focused.
- Before opening a PR:
  - [ ] `npm run validate` passes
  - [ ] `npm run demo_proof` passes
  - [ ] Versions are pinned and listed in `meta/versions.json` where needed
  - [ ] No secrets are present
  - [ ] README or stack docs are updated if behaviour changed
  - [ ] CHANGELOG entry for user-visible changes
