import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const rel of [
  "AGENTS.md",
  ".claude/CLAUDE.md",
  ".cursor/rules/vue_nuxt.mdc",
  "pages/index.vue",
  "server/api/health.get.ts",
]) {
  assert.ok(fs.existsSync(path.join(root, rel)), `missing ${rel}`);
}
const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
assert.match(agents, /server\/api/i);
console.log("[vue_nuxt_live smoke] passed");
