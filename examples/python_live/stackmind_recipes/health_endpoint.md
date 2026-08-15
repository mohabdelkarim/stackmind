# Recipe: FastAPI health endpoint

`app/api/health.py`:

```python
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}
```

Wire the router from `app/main.py`. Keep domain logic out of this file.
