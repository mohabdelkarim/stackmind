def health_payload(app_name: str) -> dict[str, object]:
    return {"ok": True, "service": app_name}
