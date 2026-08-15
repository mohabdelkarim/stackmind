#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

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
    '  stackmind upgrade <stack> [targetDir] [options]',
    '',
    'Stacks:',
    ...Object.values(stacks).map(
      (s) => `  ${(s.id || '').padEnd(10)} ${s.label} - ${s.description}`,
    ),
    '',
    'Options for init / upgrade:',
    '  --force       Overwrite existing files (upgrade: also overwrite local edits)',
    '  --dry-run     Show what would be written',
    '  --diff        Show unified diffs for files that would change',
    '  --no-mcp      Skip MCP config install',
    '  --mcp-only    Install only MCP config',
    '  -h, --help    Show help',
    '',
    'Examples:',
    '  npx github:mohabdelkarim/stackmind init nextjs',
    '  stackmind init python ./my_api --diff',
    '  stackmind upgrade nextjs . --force',
    '  stackmind doctor .',
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

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function unifiedDiff(rel, before, after) {
  const a = before == null ? [] : before.replace(/\r\n/g, '\n').split('\n');
  const b = after.replace(/\r\n/g, '\n').split('\n');
  const lines = [`--- a/${rel}`, `+++ b/${rel}`];
  const max = Math.max(a.length, b.length);
  let hunk = [];
  let start = 1;
  for (let i = 0; i < max; i += 1) {
    const left = a[i];
    const right = b[i];
    if (left === right) {
      if (hunk.length) {
        lines.push(`@@ -${start},0 +${start},0 @@`);
        lines.push(...hunk);
        hunk = [];
      }
      continue;
    }
    if (hunk.length === 0) start = i + 1;
    if (left !== undefined) hunk.push(`-${left}`);
    if (right !== undefined) hunk.push(`+${right}`);
  }
  if (hunk.length) {
    lines.push(`@@ -${start},0 +${start},0 @@`);
    lines.push(...hunk);
  }
  if (lines.length === 2) {
    lines.push('@@ (no textual diff; binary or identical encoding) @@');
  }
  return lines.join('\n');
}

function planCopy(src, destRel, destAbs) {
  const incoming = readText(src);
  if (!fs.existsSync(destAbs)) {
    return {
      kind: 'file',
      src,
      dest: destAbs,
      destRel,
      status: 'write',
      incoming,
      existing: null,
      same: false,
    };
  }
  const existing = readText(destAbs);
  const same = sha256(existing) === sha256(incoming);
  return {
    kind: 'file',
    src,
    dest: destAbs,
    destRel,
    status: same ? 'unchanged' : 'overwrite',
    incoming,
    existing,
    same,
  };
}

function planMcpMerge(srcPath, destAbs, destRel, { force }) {
  const incoming = JSON.parse(readText(srcPath));
  if (!incoming.mcpServers || typeof incoming.mcpServers !== 'object') {
    throw new Error(`Invalid MCP config: ${srcPath}`);
  }

  let existing = { mcpServers: {} };
  let existingRaw = null;
  if (fs.existsSync(destAbs)) {
    existingRaw = readText(destAbs);
    existing = JSON.parse(existingRaw);
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

  const out = `${JSON.stringify(merged, null, 2)}\n`;
  const same = existingRaw != null && sha256(existingRaw) === sha256(out);
  return {
    kind: 'mcp',
    src: srcPath,
    dest: destAbs,
    destRel,
    status: existingRaw == null ? 'write' : same ? 'unchanged' : 'merge',
    incoming: out,
    existing: existingRaw,
    same,
  };
}

function collectPlans(kit, target, options) {
  const plans = [];
  const agentsRel = kit.files?.agents || 'AGENTS.md';
  const claudeRel = kit.files?.claude || '.claude/CLAUDE.md';
  const mcpRel = kit.files?.mcp || 'mcp/mcp_config.json';

  if (!options.mcpOnly) {
    plans.push(
      planCopy(
        path.join(kit.root, agentsRel),
        'AGENTS.md',
        path.join(target, 'AGENTS.md'),
      ),
    );

    const claudeSrc = path.join(kit.root, claudeRel);
    if (fs.existsSync(claudeSrc)) {
      plans.push(
        planCopy(claudeSrc, path.join('.claude', 'CLAUDE.md'), path.join(target, '.claude', 'CLAUDE.md')),
      );
    }

    const rulesDir = path.join(kit.root, '.cursor', 'rules');
    if (fs.existsSync(rulesDir)) {
      for (const name of fs.readdirSync(rulesDir)) {
        if (!name.endsWith('.mdc')) continue;
        plans.push(
          planCopy(
            path.join(rulesDir, name),
            path.join('.cursor', 'rules', name),
            path.join(target, '.cursor', 'rules', name),
          ),
        );
      }
    }

    const recipesDir = path.join(kit.root, 'recipes');
    if (fs.existsSync(recipesDir)) {
      for (const name of fs.readdirSync(recipesDir)) {
        if (!name.endsWith('.md')) continue;
        plans.push(
          planCopy(
            path.join(recipesDir, name),
            path.join('stackmind_recipes', name),
            path.join(target, 'stackmind_recipes', name),
          ),
        );
      }
    }
  }

  if (!options.noMcp) {
    const mcpSrc = path.join(kit.root, mcpRel);
    if (fs.existsSync(mcpSrc)) {
      plans.push(
        planMcpMerge(mcpSrc, path.join(target, '.cursor', 'mcp.json'), path.join('.cursor', 'mcp.json'), options),
      );
      plans.push(
        planCopy(mcpSrc, 'stackmind.mcp.json', path.join(target, 'stackmind.mcp.json')),
      );
    }
  }

  return plans;
}

function applyPlan(plan, options) {
  if (plan.status === 'unchanged') {
    return { status: 'unchanged', dest: plan.dest };
  }

  if (plan.kind === 'file') {
    if (fs.existsSync(plan.dest) && !options.force && plan.status === 'overwrite') {
      return { status: 'skip', dest: plan.dest };
    }
    if (options.dryRun) {
      return {
        status: fs.existsSync(plan.dest) ? 'overwrite' : 'write',
        dest: plan.dest,
      };
    }
    ensureDir(path.dirname(plan.dest), false);
    fs.copyFileSync(plan.src, plan.dest);
    return {
      status: plan.existing != null ? 'overwrite' : 'write',
      dest: plan.dest,
    };
  }

  if (plan.kind === 'mcp') {
    if (options.dryRun) {
      return {
        status: fs.existsSync(plan.dest) ? 'merge' : 'write',
        dest: plan.dest,
      };
    }
    ensureDir(path.dirname(plan.dest), false);
    fs.writeFileSync(plan.dest, plan.incoming, 'utf8');
    return { status: 'merge', dest: plan.dest };
  }

  throw new Error(`Unknown plan kind: ${plan.kind}`);
}

function printDiffs(plans, target) {
  let shown = 0;
  for (const plan of plans) {
    if (plan.same) continue;
    if (plan.status === 'unchanged') continue;
    const rel = plan.destRel || path.relative(target, plan.dest);
    console.log(unifiedDiff(rel.replace(/\\/g, '/'), plan.existing, plan.incoming));
    console.log('');
    shown += 1;
  }
  if (shown === 0) {
    console.log('[stackmind] no content differences');
  }
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
      'stackmind_recipes',
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

function runInstall(stackId, targetDir, options, mode) {
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

  const plans = collectPlans(kit, target, options);

  if (options.diff) {
    console.log(`[stackmind] diff ${kit.label} -> ${target}\n`);
    printDiffs(plans, target);
  }

  if (mode === 'upgrade') {
    const diverged = plans.filter(
      (p) => p.kind === 'file' && p.existing != null && !p.same && !options.force,
    );
    for (const plan of plans) {
      if (plan.kind === 'file' && plan.existing != null && !plan.same && !options.force) {
        console.log(`  [diverged] ${plan.destRel} (local edits kept; use --force to overwrite)`);
        continue;
      }
      if (plan.same) {
        console.log(`  [unchanged] ${plan.destRel}`);
        continue;
      }
      const result = applyPlan(plan, { ...options, force: true });
      console.log(`  [${result.status}] ${plan.destRel}`);
    }
    if (diverged.length > 0 && !options.force) {
      console.log(
        `\n[stackmind] upgrade left ${diverged.length} local edit(s) untouched. Re-run with --force to overwrite.`,
      );
    } else if (!options.dryRun) {
      console.log(`\n[stackmind] upgraded ${kit.label} -> ${target}`);
    }
    return;
  }

  const label = options.dryRun ? 'Dry run' : 'Installed';
  console.log(`[stackmind] ${label} ${kit.label} -> ${target}\n`);

  for (const plan of plans) {
    if (plan.same && fs.existsSync(plan.dest)) {
      console.log(`  [unchanged] ${plan.destRel}`);
      continue;
    }
    const result = applyPlan(plan, options);
    console.log(`  [${result.status}] ${plan.destRel}`);
  }

  if (!options.dryRun && !options.diff) {
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
  const commonOptions = {
    force: flags.has('force'),
    dryRun: flags.has('dry-run'),
    diff: flags.has('diff'),
    noMcp: flags.has('no-mcp'),
    mcpOnly: flags.has('mcp-only'),
  };

  if (command === 'list') {
    listStacks();
    return;
  }

  if (command === 'doctor') {
    doctor(positional[1] || process.cwd());
    return;
  }

  if (command === 'init' || command === 'upgrade') {
    const stackId = positional[1];
    if (!stackId) {
      console.error(`[stackmind] Missing stack. Example: stackmind ${command} nextjs`);
      process.exit(1);
    }
    const targetDir = positional[2] || process.cwd();
    runInstall(stackId, targetDir, commonOptions, command);
    return;
  }

  console.error(`[stackmind] Unknown command "${command}"`);
  usage(1);
}

main();
