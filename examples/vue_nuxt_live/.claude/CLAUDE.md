# CLAUDE.md — Vue / Nuxt

## Project
Nuxt 3, TypeScript, Vue 3 Composition API, Pinia, Nitro, Vitest.

## Conventions
- `<script setup lang="ts">`
- Pages in `pages/`, API in `server/api/`
- Composables for shared logic
- No secrets in client code

## Key files
- `nuxt.config.ts`
- `app.vue`
- `server/api/`
- `stores/`

## Commands
- `npm run dev`
- `npm run build`
- `npm run test`

## Env
Use `runtimeConfig` / `.env` (never commit real values).

## Expect
Brief plan, full paths, typed Vue/Nuxt code.
