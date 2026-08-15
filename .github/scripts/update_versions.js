import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const versionsPath = path.resolve(repoRoot, 'meta/versions.json');
const configsRoot = path.resolve(repoRoot, 'configs');

function walkJsonFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Pin every known MCP package string to meta/versions.json.
 * Handles both `@scope/name@version` and bare `@scope/name` in JSON text.
 */
function pinPackagesInText(text, packages) {
  let updated = text;
  let changed = false;

  // Longest names first so scoped packages do not partially match shorter ones.
  const names = Object.keys(packages).sort((a, b) => b.length - a.length);

  for (const name of names) {
    const version = packages[name];
    if (!version || typeof version !== 'string') continue;

    const pinned = `${name}@${version}`;
    const pattern = new RegExp(`${escapeRegExp(name)}(?:@[^"\\s]+)?`, 'g');
    const next = updated.replace(pattern, pinned);
    if (next !== updated) {
      updated = next;
      changed = true;
    }
  }

  return { updated, changed };
}

function applyChangesToMeta(meta, changes) {
  if (!meta.packages || typeof meta.packages !== 'object') {
    meta.packages = {};
  }

  for (const [name, info] of Object.entries(changes || {})) {
    if (!info || typeof info !== 'object') continue;
    if (!('latest' in info)) continue;
    meta.packages[name] = info.latest;
  }

  meta.last_check = new Date().toISOString().slice(0, 10);
  return meta;
}

function main() {
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
  } catch (err) {
    console.error('[update_versions] Failed to read meta/versions.json', err?.message || err);
    process.exit(1);
  }

  const rawChanges = process.env.CHANGES;
  if (rawChanges) {
    try {
      const changes = JSON.parse(rawChanges);
      meta = applyChangesToMeta(meta, changes);
      fs.writeFileSync(versionsPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
      console.log('[update_versions] Updated meta/versions.json from CHANGES.');
    } catch (err) {
      console.error('[update_versions] Failed to parse CHANGES', err?.message || err);
      process.exit(1);
    }
  } else {
    meta.last_check = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(versionsPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
    console.log('[update_versions] No CHANGES env; syncing configs from current meta pins.');
  }

  const packages = meta.packages || {};
  const files = walkJsonFiles(configsRoot).filter((filePath) => {
    const base = path.basename(filePath);
    if (base === 'kit.json') return false;
    const rel = path.relative(configsRoot, filePath).replace(/\\/g, '/');
    return rel.includes('/mcp/');
  });
  let touched = 0;

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8');
    const { updated, changed } = pinPackagesInText(original, packages);
    if (!changed || updated === original) continue;

    // Keep valid JSON after string rewrites.
    try {
      JSON.parse(updated);
    } catch (err) {
      console.error(
        `[update_versions] Refusing to write invalid JSON: ${path.relative(repoRoot, filePath)}`,
        err?.message || err,
      );
      process.exit(1);
    }

    fs.writeFileSync(filePath, updated.endsWith('\n') ? updated : `${updated}\n`, 'utf8');
    touched += 1;
    console.log(`[update_versions] Updated ${path.relative(repoRoot, filePath)}`);
  }

  console.log(`[update_versions] Done. Files updated: ${touched}`);
}

main();
