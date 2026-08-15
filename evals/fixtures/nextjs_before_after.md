# Before kit (weak)

Agent invents a custom folder layout, marks every component `"use client"`, and reads `process.env.SECRET` without validation.

# After kit (strong)

Agent defaults to Server Components, validates env with Zod in `lib/env.ts`, keeps route handlers thin, and points to `stackmind_recipes/health_route.md`.
