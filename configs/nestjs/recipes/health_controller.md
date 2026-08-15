# Recipe: NestJS health controller

Keep controllers thin and return a simple payload for smoke checks:

```ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { ok: true };
  }
}
```

Put domain logic in a service if the check grows beyond a static response.
