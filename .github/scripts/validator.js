import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

function resolvePath(relativePath) {
  return path.resolve(repoRoot, relativePath);
}

function getJsonFiles(relativeDir) {
  const dir = resolvePath(relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(dir, file));
}

function main() {
  const files = [
    resolvePath('meta/versions.json'),
    resolvePath('configs/nextjs/mcp/mcp-config.json'),
    resolvePath('configs/python/mcp/mcp-config.json'),
    ...getJsonFiles('configs/nextjs/mcp/snippets'),
    ...getJsonFiles('configs/python/mcp/snippets'),
  ];

  let hadError = false;

  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`[validator] File not found, skipping: ${file}`);
      continue;
    }

    try {
      const raw = fs.readFileSync(file, 'utf8');
      JSON.parse(raw);
      console.log(`[validator] OK: ${path.relative(repoRoot, file)}`);
    } catch (err) {
      hadError = true;
      console.error(`[validator] INVALID JSON: ${path.relative(repoRoot, file)}`);
      console.error(err?.message || err);
    }
  }

  if (hadError) {
    process.exit(1);
  } else {
    console.log('[validator] All JSON configuration files are valid.');
  }
}

main();
