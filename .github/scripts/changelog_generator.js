import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const changelogPath = path.resolve(repoRoot, 'CHANGELOG.md');

function buildEntry(changes) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push(`[auto] - ${date}`);

  const entries = Object.entries(changes || {});
  if (entries.length === 0) {
    lines.push('No package changes');
  } else {
    lines.push('Updated');
    for (const [name, info] of entries) {
      const current = info.current ?? 'unknown';
      const latest = info.latest ?? 'unknown';
      lines.push(`- ${name}: ${current} -> ${latest}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

function main() {
  let rawChanges = process.env.CHANGES;
  let changes = {};

  if (rawChanges) {
    try {
      changes = JSON.parse(rawChanges);
    } catch (err) {
      console.error('[changelog] Failed to parse CHANGES env var as JSON', err);
      process.exit(1);
    }
  }

  let changelog;
  try {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } catch (err) {
    console.error('[changelog] Failed to read CHANGELOG.md', err);
    process.exit(1);
  }

  const entry = buildEntry(changes);
  const lines = changelog.split('\n');
  const headerIndex = lines.findIndex((line) => line.trim().startsWith('# Changelog'));

  if (headerIndex === -1) {
    const updated = `${entry}\n${changelog.trimEnd()}\n`;
    fs.writeFileSync(changelogPath, updated, 'utf8');
    console.log('[changelog] Updated CHANGELOG.md with auto entry (no header found).');
    return;
  }

  const before = lines.slice(0, headerIndex + 1).join('\n');
  const after = lines.slice(headerIndex + 1).join('\n');

  const updated = `${before}\n\n${entry}\n${after.trimStart()}\n`;
  fs.writeFileSync(changelogPath, updated.trimEnd() + '\n', 'utf8');
  console.log('[changelog] Updated CHANGELOG.md with auto entry.');
}

main();
