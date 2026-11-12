#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

function run(cmd, args, cwd) {
  console.log(`[live_smoke] ${cmd} ${args.join(' ')} (${path.relative(root, cwd)})`);
  // Windows: shell helps resolve npm.cmd on PATH, but breaks absolute node paths with spaces.
  const useShell = process.platform === 'win32' && cmd !== process.execPath;
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: useShell });
  if (res.status !== 0) {
    console.error(res.stdout);
    console.error(res.stderr);
    process.exit(res.status || 1);
  }
  if (res.stdout?.trim()) console.log(res.stdout.trim());
}

function resolvePython() {
  const candidates =
    process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python'];
  for (const cmd of candidates) {
    const res = spawnSync(cmd, ['-c', 'import sys; print(sys.version)'], {
      encoding: 'utf8',
      shell: process.platform === 'win32',
    });
    const out = `${res.stdout || ''}${res.stderr || ''}`;
    if (res.status === 0 && out && !/Microsoft Store/i.test(out)) {
      return cmd;
    }
  }
  return null;
}

const nextDir = path.join(root, 'examples/nextjs_live');
run('npm', ['install'], nextDir);
run('npm', ['run', 'smoke'], nextDir);
run('npm', ['run', 'build'], nextDir);

const pyDir = path.join(root, 'examples/python_live');
const python = resolvePython();
if (!python) {
  const msg = '[live_smoke] no usable Python interpreter found for examples/python_live';
  if (inCi) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(`${msg}; skipping locally (CI still runs pytest)`);
} else {
  run(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], pyDir);
  run(python, ['-m', 'pytest', '-q'], pyDir);
}

run(process.execPath, ['scripts/smoke.mjs'], path.join(root, 'examples/nestjs_live'));
run(process.execPath, ['scripts/smoke.mjs'], path.join(root, 'examples/vue_nuxt_live'));

console.log('[live_smoke] all live samples passed');
