# Vue / Nuxt stackmind setup

## Install

```bash
npx github:mohabdelkarim/stackmind init vue_nuxt
npx github:mohabdelkarim/stackmind doctor .
```

## Verify agents

Ask: "Where do pages and server API routes live in this Nuxt app?"

Expect: `pages/` for routes, `server/api/` for Nitro handlers, Composition API with `<script setup>`.

## Verify MCP (Cursor)

Set in the environment Cursor inherits, then restart Cursor:

| Variable | Used by |
|----------|---------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github |

Filesystem is scoped to `${workspaceFolder}`. Never commit secrets.
