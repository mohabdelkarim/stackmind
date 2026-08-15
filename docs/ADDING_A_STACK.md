# Adding a free stack kit

All stacks stay free and public. Only add a kit you have used on a real project.

## Checklist

1. Create `configs/<stack_id>/` (underscores in names, no hyphens).
2. Add `kit.json` matching `meta/kit_schema.json` (`id` must equal the folder name).
3. Add:
   - `AGENTS.md` (canonical, include anti-patterns)
   - `.claude/CLAUDE.md` (under ~80 lines)
   - `.cursor/rules/*.mdc` (short, glob scoped; prefer api/tests plus stack base)
   - `recipes/*.md` (optional snippets; installed to `stackmind_recipes/`)
   - `mcp/mcp_config.json` (pinned versions)
   - `mcp/snippets/*.json` as needed
   - `mcp/README.md`
   - `SETUP_GUIDE.md`
4. Add eval cases under `evals/cases/` for the new stack.
5. Pin any new MCP packages in `meta/versions.json`.
6. Run `npm run validate`, `npm run eval`, `npm run cli_smoke`, and `npm run doctor`.
7. Run `npm run examples` if the kit should appear under `examples/`.
8. Open a PR: `feat(<stack>): add <stack> kit` with a note on how you tested it.

The CLI discovers kits automatically from `configs/*/kit.json`. No hard coded stack list is required in `bin/stackmind.js`.
