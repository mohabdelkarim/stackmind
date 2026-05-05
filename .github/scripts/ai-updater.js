import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

if (!process.env.CEREBRAS_API_KEY) {
  console.error('[ai-updater] CEREBRAS_API_KEY is not set');
  process.exit(1);
}

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Use a supported, general-purpose production model from Cerebras
// See: https://inference-docs.cerebras.ai/models/overview
const MODEL_ID = 'gpt-oss-120b';

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

  const systemPrompt = 'You are an expert in AI developer tools configuration.';

  const userPrompt = [
    'Update this config file to reflect these version changes.',
    '',
    'Changes (JSON map of package name to {current, latest}):',
    JSON.stringify(changes, null, 2),
    '',
    'Current file content:',
    original,
    '',
    'Instructions:',
    '- Update any version pins or package identifiers so they use the "latest" values where applicable.',
    '- Do not introduce new packages or remove existing ones.',
    '- Preserve the overall structure and keys of the JSON.',
    '- Return ONLY the updated JSON, with no explanation and no markdown fences.',
  ].join('\n');

  let response;
  try {
    response = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
    });
  } catch (err) {
    console.error(`[ai-updater] Cerebras call failed for ${filePath}`, err?.message || err);
    return;
  }

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

function applyChangesToMeta(changes) {
  const metaPath = resolvePath('meta/versions.json');
  if (!fs.existsSync(metaPath)) {
    console.warn('[ai-updater] meta/versions.json not found, skipping meta update.');
    return;
  }

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (err) {
    console.error('[ai-updater] Failed to parse meta/versions.json', err?.message || err);
    return;
  }

  if (!meta.packages || typeof meta.packages !== 'object') {
    meta.packages = {};
  }

  for (const [name, info] of Object.entries(changes)) {
    if (!info || typeof info !== 'object') continue;
    if (!('latest' in info)) continue;
    meta.packages[name] = info.latest;
  }

  const today = new Date().toISOString().slice(0, 10);
  meta.last_check = today;

  try {
    fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
    console.log('[ai-updater] Updated meta/versions.json with latest versions and date.');
  } catch (err) {
    console.error('[ai-updater] Failed to write meta/versions.json', err?.message || err);
  }
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

  applyChangesToMeta(changes);
}

main().catch((err) => {
  console.error('[ai-updater] Unexpected error', err);
  process.exit(1);
});
