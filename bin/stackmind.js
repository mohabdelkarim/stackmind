#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const configsRoot = path.join(packageRoot, 'configs');

const STACKS = {
  nextjs: {
    id: 'nextjs',
    label: 'Next.js 15',
    description: 'App Router, TypeScript 5, Tailwind 4, Prisma 6, NextAuth v5',
  },
  python: {
    id: 'python',
    label: 'Python / FastAPI',
    description: 'FastAPI 0.115+, async SQLAlchemy 2, Pydantic v2, Alembic',
  },
};

function usage(exitCode = 0) {
  const lines = [
    'stackmind — install AI coding configs by stack',
    '',
    'Usage:',
    '  stackmind list',
    '  stackmind init <stack> [targetDir] [options]',
    '',
    'Stacks:',
    ...Object.values(STACKS).map((s) => `  ${s.id.padEnd(10)} ${s.label} — ${s.description}`),
    '',
    'Options:',
    '  --force       Overwrite existing files',
    '  --dry-run     Show what would be written',
    '  --no-mcp      Skip MCP config install',
    '  --mcp-only    Install only MCP config',
    '  -h, --help    Show help',
    '',
    'Examples:',
    '  npx github:mohabdelkarim/stackmind init nextjs',
    '  stackmind init python ./my-api --force',
  ];
  console.log(lines.join('\n'));
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = new Set();
  const positional = [];

  for (const arg of args) {
    if (arg === '-h' || arg === '--help') flags.add('help');
    else if (arg.startsWith('--')) flags.add(arg.slice(2));
    else positional.push(arg);
  }

  return { flags, positional };
}

function ensureDir(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest, { force, dryRun }) {
  if (fs.existsSync(dest) && !force) {
    return { status: 'skip', dest };
  }
  if (dryRun) {
    return { status: fs.existsSync(dest) ? 'overwrite' : 'write', dest };
  }
  ensureDir(path.dirname(dest), false);
  fs.copyFileSync(src, dest);
  return { status: fs.existsSync(dest) && force ? 'overwrite' : 'write', dest };
}

function writeJson(dest, data, { force, dryRun }) {
  if (fs.existsSync(dest) && !force) {
    return { status: 'skip', dest };
  }
  const body = `${JSON.stringify(data, null, 2)}\n`;
  if (dryRun) {
    return { status: fs.existsSync(dest) ? 'overwrite' : 'write', dest };
  }
  ensureDir(path.dirname(dest), false);
  fs.writeFileSync(dest, body, 'utf8');
  return { status: 'write', dest };
}

function mergeMcpConfig(srcPath, destPath, { force, dryRun }) {
  const incoming = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  if (!incoming.mcpServers || typeof incoming.mcpServers !== 'object') {
    throw new Error(`Invalid MCP config: ${srcPath}`);
  }

  let existing = { mcpServers: {} };
  if (fs.existsSync(destPath)) {
    existing = JSON.parse(fs.readFileSync(destPath, 'utf8'));
    if (!existing.mcpServers || typeof existing.mcpServers !== 'object') {
      existing = { mcpServers: {} };
    }
  }

  const merged = {
    ...existing,
    mcpServers: { ...existing.mcpServers },
  };

  for (const [name, server] of Object.entries(incoming.mcpServers)) {
    if (merged.mcpServers[name] && !force) continue;
    merged.mcpServers[name] = server;
  }

  if (dryRun) {
    return { status: fs.existsSync(destPath) ? 'merge' : 'write', dest: destPath };
  }

  ensureDir(path.dirname(destPath), false);
  fs.writeFileSync(destPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  return { status: fs.existsSync(destPath) ? 'merge' : 'write', dest: destPath };
}

function listStacks() {
  console.log('Available stacks:\n');
  for (const stack of Object.values(STACKS)) {
    const dir = path.join(configsRoot, stack.id);
    const ok = fs.existsSync(dir) ? 'ready' : 'missing';
    console.log(`  ${stack.id.padEnd(10)} ${stack.label}`);
    console.log(`             ${stack.description}`);
    console.log(`             status: ${ok}\n`);
  }
}

function initStack(stackId, targetDir, options) {
  const stack = STACKS[stackId];
  if (!stack) {
    console.error(`[stackmind] Unknown stack "${stackId}". Run: stackmind list`);
    process.exit(1);
  }

  const kitRoot = path.join(configsRoot, stackId);
  if (!fs.existsSync(kitRoot)) {
    console.error(`[stackmind] Kit not found at ${kitRoot}`);
    process.exit(1);
  }

  const target = path.resolve(targetDir);
  const results = [];

  if (!options.mcpOnly) {
    results.push(
      copyFile(path.join(kitRoot, 'AGENTS.md'), path.join(target, 'AGENTS.md'), options),
    );

    const claudeSrc = path.join(kitRoot, '.claude', 'CLAUDE.md');
    if (fs.existsSync(claudeSrc)) {
      results.push(
        copyFile(claudeSrc, path.join(target, '.claude', 'CLAUDE.md'), options),
      );
    }

    const rulesDir = path.join(kitRoot, '.cursor', 'rules');
    if (fs.existsSync(rulesDir)) {
      for (const name of fs.readdirSync(rulesDir)) {
        if (!name.endsWith('.mdc')) continue;
        results.push(
          copyFile(
            path.join(rulesDir, name),
            path.join(target, '.cursor', 'rules', name),
            options,
          ),
        );
      }
    }
  }

  if (!options.noMcp) {
    const mcpSrc = path.join(kitRoot, 'mcp', 'mcp_config.json');
    if (fs.existsSync(mcpSrc)) {
      results.push(
        mergeMcpConfig(mcpSrc, path.join(target, '.cursor', 'mcp.json'), options),
      );
      results.push(
        copyFile(mcpSrc, path.join(target, 'stackmind.mcp.json'), options),
      );
    }
  }

  const label = options.dryRun ? 'Dry run' : 'Installed';
  console.log(`[stackmind] ${label} ${stack.label} -> ${target}\n`);
  for (const result of results) {
    const rel = path.relative(target, result.dest) || result.dest;
    console.log(`  [${result.status}] ${rel}`);
  }

  if (!options.dryRun) {
    console.log('\nNext:');
    console.log(`  1. Open ${path.join(kitRoot, 'SETUP_GUIDE.md')} for verification steps`);
    console.log('  2. Restart Cursor / Claude Code so rules and MCP reload');
    console.log('  3. Set env vars for any MCP servers you enable (see mcp README)');
  }
}

function main() {
  const { flags, positional } = parseArgs(process.argv);

  if (flags.has('help') || positional.length === 0) {
    usage(flags.has('help') ? 0 : 1);
  }

  const command = positional[0];

  if (command === 'list') {
    listStacks();
    return;
  }

  if (command === 'init') {
    const stackId = positional[1];
    if (!stackId) {
      console.error('[stackmind] Missing stack. Example: stackmind init nextjs');
      process.exit(1);
    }
    const targetDir = positional[2] || process.cwd();
    initStack(stackId, targetDir, {
      force: flags.has('force'),
      dryRun: flags.has('dry-run'),
      noMcp: flags.has('no-mcp'),
      mcpOnly: flags.has('mcp-only'),
    });
    return;
  }

  console.error(`[stackmind] Unknown command "${command}"`);
  usage(1);
}

main();
