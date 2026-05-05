import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

function resolvePath(relativePath) {
  return path.resolve(repoRoot, relativePath);
}

function getSnippetFiles(relativeDir) {
  const dir = resolvePath(relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(dir, file));
}

async function updateFile(filePath, changes) {
  const original = fs.readFileSync(filePath, 'utf8');

  const systemPrompt = [
    'You are an expert AI coding assistant that updates dependency version strings in JSON configuration files for MCP servers.',
    'Only change versions when the package name appears in the provided "changes" map.',
    'Always return valid JSON with the same overall structure.',
  ].join(' ');

  const userPrompt = [
    'You are given a JSON configuration file used in an AI tooling repository.',
    '',
    'Changes (mapping of package name to {current, latest}):',
    JSON.stringify(changes, null, 2),
    '',
    'Current file content:',
    original,
    '',
    'Task:',
    '- Update any version pins or package identifiers in this file so that they use the "latest" versions from the Changes map when applicable.',
    '- Do not introduce new packages or remove existing ones.',
    '- Preserve keys and general ordering as much as possible.',
    '- Output ONLY the full updated file content as raw JSON (no markdown, no code fences, no commentary).',
  ].join('\n');

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0,
  });

  const message = response?.choices?.[0]?.message?.content;
  if (!message || typeof message !== 'string') {
    console.warn(`[ai-updater] Empty response for ${filePath}, skipping.`);
    return;
  }

  const updated = message.trim();

  try {
    JSON.parse(updated);
  } catch (err) {
    console.warn(`[ai-updater] Cerebras returned invalid JSON for ${filePath}, skipping.`, err?.message || err);
    return;
  }

  if (updated === original.trim()) {
    console.log(`[ai-updater] No changes applied to ${filePath}.`);
    return;
  }

  fs.writeFileSync(filePath, `${updated}\n`, 'utf8');
  console.log(`[ai-updater] Updated ${filePath}.`);
}

async function main() {
  const rawChanges = process.env.CHANGES;
  if (!rawChanges) {
    console.log('[ai-updater] No CHANGES env var provided, nothing to do.');
    return;
  }

  let changes;
  try {
    changes = JSON.parse(rawChanges);
  } catch (err) {
    console.error('[ai-updater] Failed to parse CHANGES env var as JSON', err);
    process.exit(1);
  }

  const targets = [
    resolvePath('configs/nextjs/mcp/mcp-config.json'),
    resolvePath('configs/python/mcp/mcp-config.json'),
    ...getSnippetFiles('configs/nextjs/mcp/snippets'),
    ...getSnippetFiles('configs/python/mcp/snippets'),
  ];

  for (const filePath of targets) {
    if (!fs.existsSync(filePath)) {
      console.warn(`[ai-updater] File not found: ${filePath}, skipping.`);
      continue;
    }

    try {
      await updateFile(filePath, changes);
    } catch (err) {
      console.error(`[ai-updater] Error updating ${filePath}`, err);
    }
  }
}

main().catch((err) => {
  console.error('[ai-updater] Unexpected error', err);
  process.exit(1);
});
