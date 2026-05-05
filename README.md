# stackmind

> Copy-paste AI coding configs for Cursor, Claude Code & all AI agents — organized by stack, auto-updated daily.

<p align="left">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg" alt="Node >=22" />
  <img src="https://img.shields.io/badge/maintained%20with-Cerebras%20AI-orange.svg" alt="Maintained with Cerebras AI" />
</p>

stackmind is a curated library of **ready-to-paste config kits** for modern AI coding tools.
Instead of rebuilding `.cursorrules`, `CLAUDE.md`, `AGENTS.md`, and MCP configs on every project, you drop in a stack-specific kit and start shipping.
A daily Cerebras-powered workflow keeps your MCP versions fresh without sacrificing control.

---

## 🧩 What's inside

| Path             | Stack                                            | Use it when you… |
| ---------------- | ------------------------------------------------ | ---------------- |
| `configs/nextjs` | Next.js 15 (App Router) · TypeScript 5 · RSC UI  | Build React apps on Vercel with NextAuth, Prisma, Tailwind, shadcn/ui. |
| `configs/python` | Python 3.12 · FastAPI 0.115 · async SQLAlchemy   | Ship async APIs with PostgreSQL, Alembic, Pydantic v2, and modern tooling. |

Each kit includes:
- Editor rules for Cursor and Claude Code.
- Agent behavior profiles (AGENTS.md).
- MCP configs + docs for Postgres, GitHub, filesystem, Brave Search, and memory.
- A setup guide you can follow in a few minutes.

---

## ⚡ Quick start

1. **Clone this repository**
   ```bash
   git clone https://github.com/mohabdelkarim/stackmind.git
   cd stackmind
   ```
2. **Pick your stack** (Next.js or Python/FastAPI) and open its folder:
   ```bash
   cd configs/nextjs   # or: cd configs/python
   ```
3. **Copy the kit into your app**
   - Copy `AGENTS.md` to your project root.
   - Copy `.claude/CLAUDE.md` and `.cursorrules` to your project.
   - Copy the `mcp/` folder and `SETUP-GUIDE.md` for that stack.
4. **Wire up environment variables**
   - Use `.env.example` as a reference.
   - Fill in real values (DATABASE_URL, secrets, URLs) in your local `.env` / `.env.local`.

In 2–3 minutes your AI tools should understand your stack, project layout, and conventions.

---

## 🤖 How the auto‑updater works

- A scheduled GitHub Actions workflow runs every day at **07:00 UTC** and inspects `meta/versions.json`.
- Using the **Cerebras `gpt-oss-120b` model**, it proposes version updates for MCP server packages and applies them to config files.
- A validation script checks all JSON output; if everything passes, it commits back to `main` with:
  ```text
  chore(auto): update MCP package versions YYYY-MM-DD
  ```
- If validation fails, the workflow opens a GitHub issue so humans can review before any changes ship.

---

## ✅ Requirements

### To use the configs

- Any editor or environment that supports **Cursor**, **Claude Code**, or similar AI coding agents.
- A project that roughly matches one of the existing stack templates (Next.js 15, Python/FastAPI, etc.).

### To run the automation

- **Node.js >= 22.0.0** for running the Node scripts and GitHub Actions locally or in CI.
- A **CEREBRAS_API_KEY** stored as a GitHub repository secret so the workflow can call the Cerebras API.

---

## 🤝 Contributing

Want to add a new stack kit or refine an existing one? Check out **[CONTRIBUTING.md](./CONTRIBUTING.md)** for structure, quality bar, and PR checklist.

---

## 📜 License

Released under the **MIT License**. See [LICENSE](./LICENSE) for full details.
