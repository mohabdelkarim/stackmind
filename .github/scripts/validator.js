import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
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

function collectCommentKeys(obj, pathSegments = []) {
  const errors = [];

  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...pathSegments, key];
      if (key === '_comment') {
        errors.push(`Found _comment key at $.${currentPath.join('.')}`);
      }
      if (value && typeof value === 'object') {
        errors.push(...collectCommentKeys(value, currentPath));
      }
    }
  }

  return errors;
}

function validateMcpConfig(filePath, json) {
  const errors = [];

  if (!json.mcpServers || typeof json.mcpServers !== 'object') {
    errors.push('Missing mcpServers key');
    return errors;
  }

  for (const [name, server] of Object.entries(json.mcpServers)) {
    if (!server || typeof server !== 'object') {
      errors.push(`Server ${name} is not an object`);
      continue;
    }
    if (!server.command) {
      errors.push(`Server ${name} is missing command`);
    }
  }

  return errors;
}

function writeOutputs({ passed, errorDetails }) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    try {
      fs.appendFileSync(outputPath, `passed=${passed ? 'true' : 'false'}\n`);
      if (!passed && errorDetails.length > 0) {
        const serialized = JSON.stringify(errorDetails).replace(/\n/g, ' ');
        fs.appendFileSync(outputPath, `ERROR_DETAILS=${serialized}\n`);
      }
    } catch (err) {
      console.error('[validator] Failed to write to GITHUB_OUTPUT', err?.message || err);
    }
  }

  const envPath = process.env.GITHUB_ENV;
  if (!passed && envPath && errorDetails.length > 0) {
    try {
      const serialized = JSON.stringify(errorDetails).replace(/\n/g, ' ');
      fs.appendFileSync(envPath, `ERROR_DETAILS=${serialized}\n`);
    } catch (err) {
      console.error('[validator] Failed to write to GITHUB_ENV', err?.message || err);
    }
  }
}

function main() {
  const files = walkJsonFiles(configsRoot);
  const errors = [];

  for (const file of files) {
    const rel = path.relative(repoRoot, file);

    let json;
    try {
      const raw = fs.readFileSync(file, 'utf8');
      json = JSON.parse(raw);
    } catch (err) {
      const msg = `[validator] INVALID JSON: ${rel} - ${err?.message || err}`;
      console.error(msg);
      errors.push(msg);
      continue;
    }

    const commentErrors = collectCommentKeys(json);
    for (const e of commentErrors) {
      const msg = `[validator] ${rel} - ${e}`;
      console.error(msg);
      errors.push(msg);
    }

    if (path.basename(file) === 'mcp-config.json') {
      const mcpErrors = validateMcpConfig(file, json);
      for (const e of mcpErrors) {
        const msg = `[validator] ${rel} - ${e}`;
        console.error(msg);
        errors.push(msg);
      }
    }
  }

  const passed = errors.length === 0;

  if (passed) {
    console.log('[validator] All config JSON files passed validation.');
  }

  writeOutputs({ passed, errorDetails: errors });

  if (!passed) {
    process.exit(1);
  }
}

main();
