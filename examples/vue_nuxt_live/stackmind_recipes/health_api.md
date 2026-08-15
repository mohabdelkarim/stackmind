# Recipe: Nuxt health API route

Create `server/api/health.get.ts`:

```ts
export default defineEventHandler(() => ({ ok: true }));
```

Keep handlers thin; move shared logic into `server/utils` when reused.
