# Recipe: Zod env module

Create `lib/env.ts`:

```ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});
```

Anti-patterns:

- Do not use `process.env.X!` without validation.
- Do not commit `.env.local`.
