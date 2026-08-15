from fastapi import APIRouter

from app.core.config import settings
from app.services.health import health_payload

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, object]:
    return health_payload(settings.app_name)
