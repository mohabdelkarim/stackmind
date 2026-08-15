# Claude Code Manual: Python/FastAPI

## Project
FastAPI backend using Python 3.12+, async SQLAlchemy 2.x, Alembic, and PostgreSQL.
Pydantic v2 for settings and validation; pytest, Ruff, and mypy for quality.
Docker and uvicorn for local and containerized development.

## Conventions
- Use type hints everywhere; no untyped functions in app/.
- Prefer async/await, never block the event loop with sync I/O.
- Use Pydantic v2 BaseModel and Settings for schemas and config.
- Enforce Ruff for style/formatting; keep imports and typing clean.
- Keep endpoints thin; move business logic into app/services/.

## Key Files
- app/main.py – FastAPI app factory and startup wiring.
- app/core/config.py – Pydantic v2 settings (DATABASE_URL, SECRET_KEY, etc.).
- app/core/database.py – async SQLAlchemy engine/session setup.
- app/models/ – ORM models and relationships.
- alembic/ – database migrations and versions.

## Commands
- uvicorn app.main:app --reload
- pytest
- alembic upgrade head
- alembic revision --autogenerate -m "description"
- ruff check .
- mypy app/

## Environment Variables
- DATABASE_URL – asyncpg DSN for PostgreSQL (e.g. postgresql+asyncpg://user:pass@host/db).
- SECRET_KEY – application secret for signing tokens and sessions.
- DEBUG – "true" or "false" to control debug features.
- ALLOWED_ORIGINS – comma-separated CORS origins.

## What I expect
1. Small, focused changes with clear intent and descriptive commit messages.
2. Type-safe, async-first code with tests for new behavior.
3. No secrets committed; use .env and documented environment variables.
4. Consistent style enforced by Ruff and mypy before opening a PR.
5. Clear notes in PRs about migrations, new env vars, and breaking changes.
