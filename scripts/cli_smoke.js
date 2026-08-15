#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'stackmind.js');

function run(args, opts = {}) {
  const res = spawnSync(process.execPath, [cli, ...args], {
    cwd: opts.cwd || root,
    encoding: 'utf8',
  });
  if (opts.expectFail) {
    if (res.status === 0) {
      console.error(`[cli_smoke] expected failure for: ${args.join(' ')}`);
      process.exit(1);
    }
    return res;
  }
  if (res.status !== 0) {
    console.error(res.stdout);
    console.error(res.stderr);
    process.exit(res.status || 1);
  }
  return res;
}

console.log('[cli_smoke] list');
run(['list']);

console.log('[cli_smoke] doctor');
run(['doctor', root]);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackmind_cli_'));
console.log(`[cli_smoke] init nextjs --diff --dry-run -> ${tmp}`);
const diffOut = run(['init', 'nextjs', tmp, '--diff', '--dry-run']);
if (!diffOut.stdout.includes('+++ b/AGENTS.md') && !diffOut.stdout.includes('[write]')) {
  console.error('[cli_smoke] expected diff or write plan for dry-run init');
  process.exit(1);
}

console.log('[cli_smoke] init nextjs --force');
run(['init', 'nextjs', tmp, '--force']);
if (!fs.existsSync(path.join(tmp, 'AGENTS.md'))) {
  console.error('[cli_smoke] AGENTS.md missing after init');
  process.exit(1);
}

fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# local edit\n', 'utf8');
console.log('[cli_smoke] upgrade without --force keeps local edit');
const up = run(['upgrade', 'nextjs', tmp]);
if (!up.stdout.includes('diverged')) {
  console.error('[cli_smoke] expected diverged on upgrade without --force');
  process.exit(1);
}
const kept = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
if (!kept.includes('local edit')) {
  console.error('[cli_smoke] local edit was overwritten without --force');
  process.exit(1);
}

console.log('[cli_smoke] upgrade --force overwrites');
run(['upgrade', 'nextjs', tmp, '--force']);
const restored = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
if (restored.includes('local edit') || !restored.includes('AGENTS.md')) {
  console.error('[cli_smoke] upgrade --force did not restore kit AGENTS.md');
  process.exit(1);
}

if (!fs.existsSync(path.join(tmp, 'stackmind_recipes'))) {
  console.error('[cli_smoke] recipes were not installed');
  process.exit(1);
}

console.log('[cli_smoke] passed');
