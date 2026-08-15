import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const rel of [
  "AGENTS.md",
  ".claude/CLAUDE.md",
  ".cursor/rules/nestjs.mdc",
  "src/app.module.ts",
  "src/health/health.controller.ts",
  "src/health/health.service.ts",
]) {
  assert.ok(fs.existsSync(path.join(root, rel)), `missing ${rel}`);
}
const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
assert.match(agents, /thin controllers/i);
console.log("[nestjs_live smoke] passed");
