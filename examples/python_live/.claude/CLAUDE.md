# CLAUDE.md — Python / FastAPI

## Project
FastAPI on Python 3.12+, async SQLAlchemy 2.x, Alembic, PostgreSQL,
Pydantic v2 settings, pytest, Ruff, mypy, Docker + uvicorn.

## Conventions
- Type hints everywhere under `app/`
- Async only on the request path; never block the event loop
- Thin routers in `app/api/`; domain logic in `app/services/`
- Settings and DB session wiring in `app/core/`

## Key files
- `app/main.py` — app factory
- `app/core/config.py` — settings
- `app/core/database.py` — engine/session
- `alembic/` — migrations

## Commands
- `uvicorn app.main:app --reload`
- `pytest`
- `alembic upgrade head`
- `alembic revision --autogenerate -m "msg"`
- `ruff check .` / `mypy app/`

## Env
`DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `ALLOWED_ORIGINS`

## Expect
Brief plan, full file paths, typed async code, migrations when models change, no secrets in git.
