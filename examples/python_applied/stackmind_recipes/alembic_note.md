# Recipe: Alembic note

When models change:

1. Update SQLAlchemy models under `app/models/`.
2. Run `alembic revision --autogenerate -m "description"`.
3. Review the generated migration diff.
4. Apply with `alembic upgrade head`.
5. Update docs/env notes if new variables are required.

Never invent migration SQL without reviewing indexes and destructive drops.
