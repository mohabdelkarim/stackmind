import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const changelogPath = path.resolve(repoRoot, 'CHANGELOG.md');

function main() {
  const rawChanges = process.env.CHANGES;
  if (!rawChanges) {
    console.log('[changelog] No CHANGES env var provided, nothing to do.');
    return;
  }

  let changes;
  try {
    changes = JSON.parse(rawChanges);
  } catch (err) {
    console.error('[changelog] Failed to parse CHANGES env var as JSON', err);
    process.exit(1);
  }

  const entries = Object.entries(changes);
  if (entries.length === 0) {
    console.log('[changelog] No package updates in CHANGES, nothing to do.');
    return;
  }

  let changelog;
  try {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } catch (err) {
    console.error('[changelog] Failed to read CHANGELOG.md', err);
    process.exit(1);
  }

  const date = new Date().toISOString().slice(0, 10);

  const sectionLines = [
    '## [Unreleased]',
    `### Updated - ${date}`,
    ...entries.map(([name, info]) => {
      const current = info.current ?? 'unknown';
      const latest = info.latest ?? 'unknown';
      return `- ${name}: ${current} → ${latest}`;
    }),
    '',
  ];

  const section = sectionLines.join('\n');

  const lines = changelog.split('\n');
  const firstVersionIndex = lines.findIndex((line) => line.startsWith('## ['));

  let updated;
  if (firstVersionIndex === -1) {
    updated = `${changelog.trimEnd()}\n\n${section}\n`;
  } else {
    const before = lines.slice(0, firstVersionIndex).join('\n');
    const after = lines.slice(firstVersionIndex).join('\n');
    updated = `${before.trimEnd()}\n\n${section}\n${after.trimStart()}\n`;
  }

  fs.writeFileSync(changelogPath, updated.trimEnd() + '\n', 'utf8');
  console.log('[changelog] Updated CHANGELOG.md with package updates.');
}

main();
