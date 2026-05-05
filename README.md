<div align="center">

<img src="https://img.shields.io/badge/stackmind-v1.0.0-6366f1?style=for-the-badge&labelColor=0f0f0f" alt="stackmind" />

# ⚡ stackmind

**Copy-paste AI coding configs for every tool, every stack.**  
Drop-in rules, agent roles, and MCP configs for Cursor, Claude Code, Copilot, Gemini, Windsurf, and more —  
kept up-to-date automatically with Cerebras AI.

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1?style=flat-square&labelColor=0f0f0f)](./LICENSE)
[![Node ≥22](https://img.shields.io/badge/Node.js-%3E%3D22-22c55e?style=flat-square&labelColor=0f0f0f)](https://nodejs.org)
[![Auto-updated](https://img.shields.io/badge/Auto--updated-Cerebras%20AI-f97316?style=flat-square&labelColor=0f0f0f)](./meta/versions.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ec4899?style=flat-square&labelColor=0f0f0f)](./CONTRIBUTING.md)

</div>

---

## The Problem

Every AI coding tool needs context about your project — your stack, your conventions, your architecture. Setting this up from scratch for every new project is repetitive and error-prone. And when MCP package versions go stale, you find out the hard way.

## The Solution

**stackmind** gives you a production-ready configuration kit per stack. Clone once, copy what you need, and your AI tools are immediately context-aware. No boilerplate. No guessing. No stale versions.

---

## 📦 Available Kits

| Stack | Path | Tools | Status |
|-------|------|-------|--------|
| **Next.js 15** | `configs/nextjs/` | App Router · TypeScript 5 · Tailwind 4 · shadcn/ui · Prisma 6 · NextAuth v5 | ✅ Complete |
| **Python / FastAPI** | `configs/python/` | FastAPI 0.115 · Python 3.12+ · async SQLAlchemy 2 · Alembic · Pydantic v2 | ✅ Complete |
| **Your stack** | — | Open an issue to request it | 🙋 Wanted |

---

## 🗂️ What's in Each Kit

| File | Works With | What It Does |
|------|-----------|--------------|
| `.cursorrules` | Cursor | Global AI rules for your stack |
| `.cursor/rules/*.mdc` | Cursor | Scoped rules with file globs |
| `.claude/CLAUDE.md` | Claude Code | Project manual: conventions, commands, env vars |
| `AGENTS.md` | All agents | Role definitions: architect, backend, reviewer… |
| `mcp/mcp-config.json` | Claude Desktop · Cursor | MCP server config, pinned versions |
| `mcp/snippets/*.json` | Any MCP client | Individual server snippets to mix-and-match |
| `mcp/README.md` | You | Docs for each MCP server + how to get API keys |
| `SETUP-GUIDE.md` | You | Step-by-step setup + verification for every tool |

---

## 🚀 Quick Start

```bash
# 1. Clone stackmind
git clone https://github.com/mohabdelkarim/stackmind.git
cd stackmind

# 2. Pick your stack and copy into your project
cp -r configs/nextjs/.cursorrules          ~/your-project/
cp -r configs/nextjs/.cursor               ~/your-project/
cp -r configs/nextjs/.claude               ~/your-project/
cp    configs/nextjs/AGENTS.md             ~/your-project/
cp -r configs/nextjs/mcp/mcp-config.json   ~/your-project/

# 3. Validate that all configs are intact
npm ci && npm run validate
```

Then open `configs/nextjs/SETUP-GUIDE.md` for the full walkthrough.

---

## 🤖 Auto-Updater

Every day at **07:00 UTC**, a GitHub Actions workflow:

1. **Checks** npm for new versions of every MCP package in `meta/versions.json`
2. **Updates** all version pins across `configs/*/mcp/` using **Cerebras `llama-3.3-70b`**
3. **Validates** every JSON file — fails loudly and opens an issue if anything breaks
4. **Commits** back to `main` → `chore(auto): update MCP package versions YYYY-MM-DD`
5. **Logs** the change in `CHANGELOG.md` automatically

You stay on latest MCP versions. Zero manual work.

> **Requirements:** `CEREBRAS_API_KEY` set as a GitHub repository secret.

---

## 🛠️ Local Scripts

```bash
npm run check      # Check for new MCP package versions
npm run update     # Run Cerebras AI updater on configs
npm run validate   # Validate all JSON config files
npm run changelog  # Generate CHANGELOG entry from updates
```

---

## 🤝 Contributing

Want to add a new stack kit (Vue, Laravel, Go, Rust…)?  
See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the step-by-step guide.

The bar is simple: production-ready defaults, valid JSON, pinned versions, tested in a real project.

---

## 📄 License

MIT © [stackmind Contributors](./LICENSE)

---

<div align="center">
<sub>Built with ⚡ Cerebras AI · Maintained by <a href="https://github.com/mohabdelkarim">mohabdelkarim</a></sub>
</div>
