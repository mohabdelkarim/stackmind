# Contributing to stackmind

Thank you for considering a contribution to **stackmind**. This project provides copy-paste configuration kits for AI coding tools (Cursor, Claude Code, Copilot, Gemini, Windsurf, and more) organized by tech stack.

## Ways to Contribute

- **Add a new stack kit** following the existing `configs/nextjs/` and `configs/python/` structure.
- **Improve existing configs** by refining rules, commands, or documentation.
- **Fix automation bugs** in the GitHub Actions workflows or Node scripts.
- **Improve documentation** (README, SETUP-GUIDE, MCP READMEs, AGENTS.md) to make the project easier to adopt.

## Adding a New Stack Kit

1. **Create the stack directory**
   - Under `configs/`, create a new folder named after your stack, for example `configs/rails/` or `configs/remix/`.

2. **Add the required files**
   Each stack should include at least the following files:
   - `configs/<stack>/.cursorrules`
   - `configs/<stack>/.cursor/rules/<stack>.mdc`
   - `configs/<stack>/.claude/CLAUDE.md`
   - `configs/<stack>/AGENTS.md`
   - `configs/<stack>/mcp/mcp-config.json`
   - `configs/<stack>/mcp/snippets/*.json`
   - `configs/<stack>/mcp/README.md`
   - `configs/<stack>/SETUP-GUIDE.md`

3. **Update version metadata**
   - If your stack introduces new MCP servers or packages, update `meta/versions.json` with the pinned versions.

4. **Open a pull request**
   - Use a descriptive title such as: `feat(<stack>): add <stack> configuration kit`.
   - Describe the stack, the tools it targets, and how you tested it in a real project.

## Code Style

- **JSON files must be valid**: no comments, no trailing commas, and no `_comment` keys. Use README files for documentation instead.
- **MCP package versions must be pinned**: include explicit version suffixes (for example `@0.6.2` or date-based tags) in MCP configs.
- **No secrets ever committed**: do not commit `.env` files, API keys, tokens, or any credentials. Use `.env.example` and documentation to show placeholder values.

## Commit Convention

- Follow **Conventional Commits** for all changes:
  - Types: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`, `perf`, `style`.
  - Optional scopes, for example: `feat(nextjs): ...`, `docs(python): ...`.
- Keep commits **atomic**: one logical change per commit, with a clear message.

## PR Checklist

Before opening a pull request, please ensure:

- [ ] All JSON files are valid and parseable.
- [ ] MCP package versions are pinned and listed in `meta/versions.json` where appropriate.
- [ ] No secrets or real credentials are present in any file.
- [ ] README or stack-specific docs are updated if behavior or workflows changed.
- [ ] A relevant CHANGELOG entry is added when user-visible behavior changes.
