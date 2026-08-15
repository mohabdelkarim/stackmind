# Before kit (weak)

Agent puts SQL and business rules inside FastAPI route functions and uses sync DB calls inside `async def`.

# After kit (strong)

Agent keeps routers thin, moves logic to `app/services/`, uses async SQLAlchemy, and mentions Alembic when models change.
