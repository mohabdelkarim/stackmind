#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const configsRoot = path.join(packageRoot, 'configs');

function loadKit(stackId) {
  const kitRoot = path.join(configsRoot, stackId);
  const kitPath = path.join(kitRoot, 'kit.json');
  if (!fs.existsSync(kitPath)) return null;
  const kit = JSON.parse(fs.readFileSync(kitPath, 'utf8'));
  return { ...kit, root: kitRoot };
}

function discoverStacks() {
  if (!fs.existsSync(configsRoot)) return {};
  const stacks = {};
  for (const name of fs.readdirSync(configsRoot)) {
    const kit = loadKit(name);
    if (!kit) continue;
    stacks[kit.id || name] = kit;
  }
  return stacks;
}

function usage(exitCode = 0) {
  const stacks = discoverStacks();
  const lines = [
    'stackmind - install free AI coding configs by stack',
    '',
    'Usage:',
    '  stackmind list',
    '  stackmind doctor [targetDir]',
    '  stackmind init <stack> [targetDir] [options]',
    '',
    'Stacks:',
    ...Object.values(stacks).map(
      (s) => `  ${(s.id || '').padEnd(10)} ${s.label} - ${s.description}`,
    ),
    '',
    'Options for init:',
    '  --force       Overwrite existing files',
    '  --dry-run     Show what would be written',
    '  --no-mcp      Skip MCP config install',
    '  --mcp-only    Install only MCP config',
    '  -h, --help    Show help',
    '',
    'Examples:',
    '  npx github:mohabdelkarim/stackmind init nextjs',
    '  stackmind doctor .',
    '  stackmind init python ./my_api --force',
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
  return { status: force ? 'overwrite' : 'write', dest };
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
  return { status: 'merge', dest: destPath };
}

function listStacks() {
  const stacks = discoverStacks();
  console.log('Available stacks (free MIT):\n');
  for (const stack of Object.values(stacks)) {
    const ok = fs.existsSync(stack.root) ? 'ready' : 'missing';
    console.log(`  ${(stack.id || '').padEnd(10)} ${stack.label}`);
    console.log(`             ${stack.description}`);
    console.log(`             status: ${ok}\n`);
  }
}

function doctor(targetDir) {
  const target = path.resolve(targetDir);
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  let failed = 0;

  console.log(`[stackmind] doctor -> ${target}\n`);

  const checks = [];

  if (nodeMajor >= 22) {
    checks.push({ ok: true, msg: `Node.js ${process.versions.node} (>= 22)` });
  } else {
    checks.push({ ok: false, msg: `Node.js ${process.versions.node} (need >= 22)` });
    failed += 1;
  }

  if (fs.existsSync(configsRoot)) {
    checks.push({ ok: true, msg: `configs present at ${configsRoot}` });
  } else {
    checks.push({ ok: false, msg: 'configs/ directory missing' });
    failed += 1;
  }

  const stacks = discoverStacks();
  const stackIds = Object.keys(stacks);
  if (stackIds.length > 0) {
    checks.push({ ok: true, msg: `kits: ${stackIds.join(', ')}` });
  } else {
    checks.push({ ok: false, msg: 'no kit.json files found under configs/' });
    failed += 1;
  }

  for (const kit of Object.values(stacks)) {
    const agents = path.join(kit.root, kit.files?.agents || 'AGENTS.md');
    const claude = path.join(kit.root, kit.files?.claude || '.claude/CLAUDE.md');
    const mcp = path.join(kit.root, kit.files?.mcp || 'mcp/mcp_config.json');
    const rulesDir = path.join(kit.root, '.cursor', 'rules');
    const bits = [
      fs.existsSync(agents) ? 'AGENTS.md' : null,
      fs.existsSync(claude) ? 'CLAUDE.md' : null,
      fs.existsSync(mcp) ? 'mcp_config.json' : null,
      fs.existsSync(rulesDir) ? 'rules' : null,
    ].filter(Boolean);
    const complete = bits.length === 4;
    checks.push({
      ok: complete,
      msg: complete
        ? `kit ${kit.id} complete (${bits.join(', ')})`
        : `kit ${kit.id} incomplete (found: ${bits.join(', ') || 'none'})`,
    });
    if (!complete) failed += 1;
  }

  if (!fs.existsSync(target)) {
    checks.push({ ok: false, msg: `target does not exist: ${target}` });
    failed += 1;
  } else {
    checks.push({ ok: true, msg: `target exists: ${target}` });
    const markers = [
      'AGENTS.md',
      '.claude/CLAUDE.md',
      '.cursor/mcp.json',
      'stackmind.mcp.json',
    ];
    for (const rel of markers) {
      const p = path.join(target, rel);
      if (fs.existsSync(p)) {
        checks.push({ ok: true, msg: `found in target: ${rel}` });
      } else {
        checks.push({ ok: true, msg: `not installed yet: ${rel} (ok before init)` });
      }
    }
  }

  for (const c of checks) {
    console.log(`  [${c.ok ? 'ok' : 'fail'}] ${c.msg}`);
  }

  if (failed > 0) {
    console.error(`\n[stackmind] doctor failed (${failed} issue(s))`);
    process.exit(1);
  }
  console.log('\n[stackmind] doctor passed');
}

function initStack(stackId, targetDir, options) {
  const stacks = discoverStacks();
  const kit = stacks[stackId];
  if (!kit) {
    console.error(`[stackmind] Unknown stack "${stackId}". Run: stackmind list`);
    process.exit(1);
  }

  const target = path.resolve(targetDir);
  if (!options.dryRun && !fs.existsSync(target)) {
    ensureDir(target, false);
  }

  const results = [];
  const agentsRel = kit.files?.agents || 'AGENTS.md';
  const claudeRel = kit.files?.claude || '.claude/CLAUDE.md';
  const mcpRel = kit.files?.mcp || 'mcp/mcp_config.json';

  if (!options.mcpOnly) {
    results.push(
      copyFile(path.join(kit.root, agentsRel), path.join(target, 'AGENTS.md'), options),
    );

    const claudeSrc = path.join(kit.root, claudeRel);
    if (fs.existsSync(claudeSrc)) {
      results.push(
        copyFile(claudeSrc, path.join(target, '.claude', 'CLAUDE.md'), options),
      );
    }

    const rulesDir = path.join(kit.root, '.cursor', 'rules');
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
    const mcpSrc = path.join(kit.root, mcpRel);
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
  console.log(`[stackmind] ${label} ${kit.label} -> ${target}\n`);
  for (const result of results) {
    const rel = path.relative(target, result.dest) || result.dest;
    console.log(`  [${result.status}] ${rel}`);
  }

  if (!options.dryRun) {
    const setup = path.join(kit.root, kit.files?.setup || 'SETUP_GUIDE.md');
    console.log('\nNext:');
    console.log(`  1. Read ${setup}`);
    console.log('  2. Restart Cursor / Claude Code so rules and MCP reload');
    console.log('  3. Set env vars for MCP servers you enable (see mcp README)');
    console.log('  4. Run: stackmind doctor <targetDir>');
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

  if (command === 'doctor') {
    doctor(positional[1] || process.cwd());
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
