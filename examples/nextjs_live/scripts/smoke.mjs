import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Smoke without full Next runtime: ensure kit files + source shape exist.
const required = [
  "AGENTS.md",
  ".claude/CLAUDE.md",
  ".cursor/rules/nextjs.mdc",
  "lib/env.ts",
  "lib/greeting.ts",
  "app/page.tsx",
  "app/api/health/route.ts",
];

for (const rel of required) {
  const full = path.join(root, rel);
  assert.ok(require("node:fs").existsSync(full), `missing ${rel}`);
}

const agents = require("node:fs").readFileSync(path.join(root, "AGENTS.md"), "utf8");
assert.match(agents, /Server Components/i);
assert.match(agents, /Zod/);

console.log("[nextjs_live smoke] passed");
