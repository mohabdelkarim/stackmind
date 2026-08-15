# AGENTS.md

> Canonical agent instructions for this repo. Read by Cursor, Claude Code, Copilot, Gemini CLI, Windsurf, Codex, Aider, Zed, Warp, and RooCode.
> Cursor-scoped overlays live in `.cursor/rules/*.mdc`. Claude-specific commands and env notes live in `.claude/CLAUDE.md`.

## Project Overview

A production-ready FastAPI 0.115+ backend using Python 3.12+ and async SQLAlchemy 2.x when persistence is needed.
Pydantic v2 settings, pytest + pytest-asyncio, Ruff, mypy.
Battle-tested against `examples/python_live` (thin `app/api`, logic in `app/services`, settings in `app/core`).

## Project structure

- `app/api/` HTTP routes (keep thin)
- `app/services/` domain logic
- `app/models/` SQLAlchemy models when used
- `app/core/` settings, database, logging, security
- `alembic/` migrations when used
- `tests/` pytest suites

## [architect]

- Keep `app/api/` thin; push domain logic into `app/services/`.
- Centralize settings in `app/core/config.py`.

## [backend]

- Async FastAPI routes and dependencies.
- Pydantic v2 for request/response contracts.
- Prefer `httpx.AsyncClient` + ASGITransport in tests.

## [database]

- Use async SQLAlchemy 2.x + Alembic when you need persistence.
- Do not block the event loop.

## [testing]

- pytest + pytest-asyncio.
- Cover health and critical auth/data paths.

## [reviewer]

- Type hints everywhere under `app/`.
- No secrets in git.
- Migrations and env docs updated with schema changes.

## Global Rules

- Explicitness over magic.
- Show full file paths (example: `app/api/health.py`).
- Smoke test with `pytest` in `examples/python_live` style.

## Anti-patterns

- Do not put domain logic in `app/api/` routers; use `app/services/`.
- Do not block the event loop with sync I/O in async routes.
- Do not hardcode secrets; use Pydantic Settings from the environment.
- Do not change models without an Alembic migration when persistence is used.
- Do not skip type hints under `app/`.

## Recipes

Snippet recipes ship under `stackmind_recipes/` after `stackmind init` (health endpoint, settings, Alembic note).
