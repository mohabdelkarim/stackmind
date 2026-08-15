# Recipe: health API route

Create `app/api/health/route.ts`:

```ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true });
}
```

Checklist:

- Keep the handler thin.
- Do not read secrets here unless required.
- Add a smoke check that hits `/api/health`.
