# Recipe: Pydantic Settings

`app/core/config.py`:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    debug: bool = False
    database_url: str | None = None
    secret_key: str = "change-me"


settings = Settings()
```

Anti-patterns:

- Do not hardcode production secrets.
- Do not block the event loop with sync DB drivers when async is available.
