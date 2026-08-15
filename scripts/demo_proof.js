#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'bin', 'stackmind.js');

function run(args) {
  const res = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  if (res.status !== 0) {
    console.error(res.stdout);
    console.error(res.stderr);
    process.exit(res.status || 1);
  }
  return res.stdout;
}

function mustExist(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[demo_proof] missing: ${filePath}`);
    process.exit(1);
  }
}

console.log('[demo_proof] doctor (repo)');
run(['doctor', root]);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackmind_proof_'));
console.log(`[demo_proof] init nextjs -> ${tmp}`);
run(['init', 'nextjs', tmp, '--force']);

mustExist(path.join(tmp, 'AGENTS.md'));
mustExist(path.join(tmp, '.claude', 'CLAUDE.md'));
mustExist(path.join(tmp, '.cursor', 'mcp.json'));
mustExist(path.join(tmp, 'stackmind.mcp.json'));

const rulesDir = path.join(tmp, '.cursor', 'rules');
const rules = fs.existsSync(rulesDir)
  ? fs.readdirSync(rulesDir).filter((f) => f.endsWith('.mdc'))
  : [];
if (rules.length < 1) {
  console.error('[demo_proof] no .mdc rules installed');
  process.exit(1);
}

const mcp = JSON.parse(fs.readFileSync(path.join(tmp, '.cursor', 'mcp.json'), 'utf8'));
if (!mcp.mcpServers || Object.keys(mcp.mcpServers).length < 1) {
  console.error('[demo_proof] mcpServers empty');
  process.exit(1);
}

console.log('[demo_proof] doctor (installed target)');
run(['doctor', tmp]);

const tmpPy = fs.mkdtempSync(path.join(os.tmpdir(), 'stackmind_proof_py_'));
console.log(`[demo_proof] init python -> ${tmpPy}`);
run(['init', 'python', tmpPy, '--force']);
mustExist(path.join(tmpPy, 'AGENTS.md'));
mustExist(path.join(tmpPy, '.claude', 'CLAUDE.md'));

console.log('[demo_proof] passed');
console.log(`  nextjs fixture: ${tmp}`);
console.log(`  python fixture: ${tmpPy}`);
