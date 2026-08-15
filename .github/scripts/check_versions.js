import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionsPath = path.resolve(__dirname, '../../meta/versions.json');

async function main() {
  let meta;
  try {
    const raw = fs.readFileSync(versionsPath, 'utf8');
    meta = JSON.parse(raw);
  } catch (err) {
    console.error('[check_versions] Failed to read meta/versions.json', err);
    process.exit(1);
  }

  const packages = meta?.packages || {};
  const changes = {};

  for (const [name, current] of Object.entries(packages)) {
    const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[check_versions] Failed to fetch ${name}: ${res.status} ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      const latest = data?.version;
      if (!latest) {
        console.warn(`[check_versions] No version field in npm response for ${name}`);
        continue;
      }
      if (latest !== current) {
        changes[name] = { current, latest };
      }
    } catch (err) {
      console.warn(`[check_versions] Error fetching ${name}:`, err?.message || err);
    }
  }

  const outPath = process.env.GITHUB_OUTPUT;
  const hasUpdates = Object.keys(changes).length > 0;

  if (hasUpdates) {
    console.log(`[check_versions] updates found: ${JSON.stringify(changes)}`);
  } else {
    console.log('[check_versions] no updates');
  }

  if (!outPath) {
    return;
  }

  try {
    fs.appendFileSync(outPath, `has_updates=${hasUpdates ? 'true' : 'false'}\n`);
    if (hasUpdates) {
      // GitHub Actions output values must be single-line.
      fs.appendFileSync(outPath, `changes=${JSON.stringify(changes)}\n`);
    }
  } catch (err) {
    console.error('[check_versions] Failed to write to GITHUB_OUTPUT', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[check_versions] Unexpected error', err);
  process.exit(1);
});
