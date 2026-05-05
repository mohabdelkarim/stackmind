# **stackmind**

Copy-paste AI coding configs for Cursor, Claude Code & all AI agents — organized by stack, auto-updated daily.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)
![Maintained with Cerebras AI](https://img.shields.io/badge/maintained%20with-Cerebras%20AI-orange.svg)

## What's Inside

| Path            | Stack                                        |
| --------------- | -------------------------------------------- |
| `configs/nextjs` | Next.js 15 (App Router) + TypeScript 5       |
| `configs/python` | Python 3.12 + FastAPI 0.115 + async SQLAlchemy |

## Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/mohabdelkarim/stackmind.git
   cd stackmind
   ```
2. Change into the config folder that matches your stack (for example Next.js or Python/FastAPI):
   ```bash
   cd configs/nextjs   # or configs/python
   ```
3. Copy the configuration files into your project, keeping the same structure (AGENTS.md, .claude/CLAUDE.md, .cursorrules, MCP configs, SETUP-GUIDE.md).
4. Fill your project's `.env` / `.env.local` with real values based on the provided `.env.example` and stack-specific guides.

## How the Auto-Updater Works

- A daily cron job runs at **07:00 UTC** to check for new MCP server versions.
- The workflow uses **Cerebras llama-3.3-70b** to update version pins in MCP configs in a controlled, JSON-valid way.
- When changes are detected and validated, it commits back to `main` with a message like: `chore(auto): update MCP package versions YYYY-MM-DD`.

## Requirements

### To use configs

- Any editor or environment that supports **Cursor**, **Claude Code**, or similar AI coding agents.
- A project that roughly matches one of the existing stack templates (Next.js 15, Python/FastAPI, etc.).

### To run automation

- **Node.js >= 22.0.0** installed for running the scripts locally or in CI.
- A **CEREBRAS_API_KEY** configured as a GitHub repository secret so the workflow can call the Cerebras API.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add new stacks or improve existing kits.

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
