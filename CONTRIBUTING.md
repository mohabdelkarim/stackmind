# Contributing to stackmind

Thank you for helping improve stackmind. This repository is a collection of **copy-paste configuration kits** for AI coding tools (Cursor, Claude Code, Copilot, Gemini, Windsurf, etc.) organized by tech stack.

This document explains how to add a new stack, what files are required, and the quality bar expected for every contribution.

## How to add a new stack

1. **Fork the repository**
   - Click "Fork" on GitHub and clone your fork locally.

2. **Create a feature branch**
   - Use a descriptive name such as `feat/{stack-name}-kit`.

3. **Create the stack directory**
   - Under `configs/`, create a new folder named after your stack, for example:
     - `configs/rails/`
     - `configs/deno/`
   - Follow the same structure used by existing stacks (Next.js and Python/FastAPI).

4. **Add all required files for the new stack**
   - See **File requirements for a new stack** below.

5. **Integrate with a real project**
   - Copy your new stack configs into a real project that uses that stack.
   - Verify that Cursor, Claude Code, and other tools behave as expected (correct paths, commands, and env vars).

6. **Run validation checks**
   - Ensure all JSON files are valid (for example `npm run validate` or a local JSON linter).
   - Check line-count limits for `.cursorrules` and `CLAUDE.md` (see quality bar below).

7. **Open a pull request**
   - Describe the stack, supported tools, and any special notes (e.g. database, framework version).
   - Include links or notes about how you tested the configuration in a real project.

## File requirements for a new stack

Every new stack under `configs/{stack}/` must include these **7 required files**:

1. `configs/{stack}/.cursorrules`  
   Global Cursor rules for the stack (high-level guidance, project layout, and conventions).

2. `configs/{stack}/.cursor/rules/{stack}.mdc`  
   Cursor `.mdc` rules file scoped to the stack's source files (with appropriate `globs` and description).

3. `configs/{stack}/.claude/CLAUDE.md`  
   Claude Code project manual for the stack (conventions, commands, key files, env vars).

4. `configs/{stack}/AGENTS.md`  
   Universal agent configuration defining roles (architect, backend, testing, reviewer, etc.) tuned to the stack.

5. `configs/{stack}/mcp/mcp-config.json`  
   Model Context Protocol (MCP) server configuration for the stack (Postgres, GitHub, filesystem, search, memory, etc.).

6. `configs/{stack}/mcp/README.md`  
   Documentation for each MCP server: what it does, when to use it, how to set credentials, and placeholders to replace.

7. `configs/{stack}/SETUP-GUIDE.md`  
   Step-by-step guide explaining how to apply the stack's configs to a real project and how to verify everything works.

Additional MCP snippet files (for example `configs/{stack}/mcp/snippets/*.json`) are strongly recommended when the stack uses multiple MCP servers.

## Quality bar

To keep all stacks consistent and easy to use, we enforce the following quality bar:

- **CLAUDE.md length**: keep `configs/{stack}/.claude/CLAUDE.md` under **60 lines**.
- **Cursor rules length**: keep `configs/{stack}/.cursorrules` under **85 lines**.
- **Valid JSON everywhere**: all `.json` files under `configs/` and `meta/` must parse cleanly (no comments, no trailing commas).
- **No `_comment` keys**: JSON configs must not include `_comment` keys; use the corresponding README files for documentation instead.
- **Tested in a real project**: every stack should be applied to at least one real project and exercised with the intended tools.
- **Clear, production-ready defaults**: commands and paths should match common production setups, not one-off experiments.

## Reporting issues and requesting new stacks

If you hit a problem or want to request support for a new stack:

- Open an issue on GitHub with a clear title and description.
- For bugs, include the stack name, the tool you are using (Cursor, Claude, etc.), and a minimal reproduction if possible.
- For new stack requests, include tech details (framework, language, test runner, database) and any existing conventions you follow.

Issues are the primary place to discuss new stacks, improvements to existing kits, and automation-related bugs.

## Code of conduct

This project follows a simple principle:

> **Be respectful and constructive.**

Treat maintainers and contributors with respect, focus on technical feedback, and assume good intent. Disagreements are fine; harassment or personal attacks are not.
