# AGENTS.md

> Canonical agent instructions for this repo. Read by Cursor, Claude Code, Copilot, Gemini CLI, Windsurf, Codex, Aider, Zed, Warp, and RooCode.
> Cursor-scoped overlays live in `.cursor/rules/*.mdc`. Claude-specific commands and env notes live in `.claude/CLAUDE.md`.

## Project Overview

A production-ready FastAPI 0.115+ backend using Python 3.12+ and async SQLAlchemy 2.x.
PostgreSQL with Alembic migrations, Pydantic v2 for schemas and settings.
Quality enforced via pytest, pytest-asyncio, Ruff, mypy, and containerized dev with Docker.

## Project structure

- `app/api/` HTTP routes (keep thin)
- `app/services/` domain logic
- `app/models/` SQLAlchemy models
- `app/core/` settings, database, logging, security
- `alembic/` migrations
- `tests/` pytest suites

## [architect]

- Define the overall service boundaries, module layout, and API surface.
- Keep `app/api/` thin and push domain logic into `app/services/` and `app/models/`.
- Ensure settings, logging, and error handling are centralized in `app/core/`.
- Guard non-functional requirements: performance, observability, and security.

## [backend]

- Implement FastAPI routes, dependencies, and background tasks.
- Use async SQLAlchemy 2.x with asyncpg and transactional patterns.
- Apply Pydantic v2 models for all request/response contracts.
- Keep code tested, type-checked, and aligned with the architect's design.

## [database]

- Design normalized schemas and indexes in `app/models/`.
- Manage Alembic migrations and review auto-generated diffs.
- Optimize queries and connection usage for async workloads.
- Coordinate with backend to evolve schemas without breaking clients.

## [testing]

- Maintain pytest and pytest-asyncio test suites.
- Provide fixtures for DB, `httpx.AsyncClient`, and settings overrides.
- Enforce fast, deterministic tests suitable for CI and local runs.
- Track coverage on critical paths (auth, error handling, data integrity).

## [reviewer]

- Review for correctness, security, and alignment with conventions.
- Check type hints, async boundaries, and transaction handling.
- Ensure migrations, env vars, and docs are updated with code changes.
- Request incremental refactors to keep the codebase healthy.

## Global Rules

- Favor explicitness over magic; avoid hidden side effects and global state.
- Never block the event loop with sync I/O; wrap in executors only when necessary.
- Use type hints everywhere; no untyped functions in `app/`.
- Do not commit secrets or production credentials; use environment variables and `.env.example`.
- Keep public APIs stable; document and version any breaking changes.
- Prefer small, composable modules and functions over large, monolithic ones.
- Every meaningful change should ship with tests, type-checks, and updated docs.
- When generating or editing code, show the full file path (for example `app/api/users.py`).
- Call out required environment variables whenever changing configuration or authentication.
