#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args, cwd) {
  console.log(`[live_smoke] ${cmd} ${args.join(' ')} (${path.relative(root, cwd)})`);
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
  if (res.status !== 0) {
    console.error(res.stdout);
    console.error(res.stderr);
    process.exit(res.status || 1);
  }
  if (res.stdout?.trim()) console.log(res.stdout.trim());
}

const nextDir = path.join(root, 'examples/nextjs_live');
run('npm', ['install'], nextDir);
run('npm', ['run', 'smoke'], nextDir);
run('npm', ['run', 'build'], nextDir);

const pyDir = path.join(root, 'examples/python_live');
run('python', ['-m', 'pip', 'install', '-r', 'requirements.txt'], pyDir);
run('python', ['-m', 'pytest', '-q'], pyDir);

run(process.execPath, ['scripts/smoke.mjs'], path.join(root, 'examples/nestjs_live'));
run(process.execPath, ['scripts/smoke.mjs'], path.join(root, 'examples/vue_nuxt_live'));

console.log('[live_smoke] all live samples passed');
