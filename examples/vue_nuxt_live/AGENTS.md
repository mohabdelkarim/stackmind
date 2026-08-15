# AGENTS.md

> Canonical agent instructions. Cursor overlays: `.cursor/rules/*.mdc`. Claude notes: `.claude/CLAUDE.md`.

## Project Overview

Nuxt 3 application with TypeScript, Vue 3 Composition API,
Pinia for client state, Nitro server routes when needed,
Vitest for unit tests.

## Project structure

- `app.vue` / `pages/` routes
- `components/` UI
- `composables/` shared composition functions
- `server/api/` Nitro endpoints
- `stores/` Pinia stores
- `utils/` pure helpers

## [architect]

- Prefer file based routing in `pages/`.
- Keep server logic in `server/` not in Vue components.
- Decide when Pinia is needed vs local component state.

## [frontend]

- Use `<script setup lang="ts">` and Composition API.
- Keep components small and typed props/emits.
- Prefer Nuxt auto imports consistently; do not mix styles randomly.

## [backend]

- Implement Nitro handlers under `server/api/`.
- Validate request bodies before side effects.
- Keep secrets on the server only (`runtimeConfig`).

## [reviewer]

- No `any`. Prefer explicit types for public APIs.
- No secrets in client bundles.
- Check accessibility basics on interactive UI.

## Global Rules

- Use Nuxt conventions before inventing structure.
- Prefer composables for reusable logic.
- Show full file paths when editing code.
- Never commit secrets.
