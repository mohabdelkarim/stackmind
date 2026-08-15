# Adding a free stack kit

All stacks stay free and public. Only add a kit you have used on a real project.

## Checklist

1. Create `configs/<stack_id>/` (underscores in names, no hyphens).
2. Add `kit.json` with `id`, `label`, `description`, `files`, `mcp_packages`.
3. Add:
   - `AGENTS.md` (canonical)
   - `.claude/CLAUDE.md` (under ~80 lines)
   - `.cursor/rules/<name>.mdc` (short, glob scoped)
   - `mcp/mcp_config.json` (pinned versions)
   - `mcp/snippets/*.json` as needed
   - `mcp/README.md`
   - `SETUP_GUIDE.md`
4. Pin any new MCP packages in `meta/versions.json`.
5. Run `node bin/stackmind.js doctor` and `npm run validate`.
6. Run `npm run examples` if the kit should appear under `examples/`.
7. Open a PR: `feat(<stack>): add <stack> kit` with a note on how you tested it.

The CLI discovers kits automatically from `configs/*/kit.json`. No hard coded stack list is required in `bin/stackmind.js`.
