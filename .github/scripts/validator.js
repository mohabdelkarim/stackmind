import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const configsRoot = path.resolve(repoRoot, 'configs');
const kitSchemaPath = path.resolve(repoRoot, 'meta/kit_schema.json');

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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

function validateKitJson(filePath, json, schema) {
  const errors = [];
  const rel = path.relative(repoRoot, filePath);
  const dirName = path.basename(path.dirname(filePath));

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    errors.push('kit.json must be an object');
    return errors;
  }

  for (const key of Object.keys(json)) {
    if (!Object.prototype.hasOwnProperty.call(schema.properties, key)) {
      errors.push(`Unknown key "${key}" (additionalProperties false)`);
    }
  }

  for (const required of schema.required || []) {
    if (!(required in json)) {
      errors.push(`Missing required key "${required}"`);
    }
  }

  if ('id' in json) {
    if (!isNonEmptyString(json.id)) {
      errors.push('id must be a non empty string');
    } else if (!/^[a-z][a-z0-9_]*$/.test(json.id)) {
      errors.push('id must match ^[a-z][a-z0-9_]*$');
    } else if (json.id !== dirName) {
      errors.push(`id "${json.id}" must match folder name "${dirName}"`);
    }
  }

  if ('label' in json && !isNonEmptyString(json.label)) {
    errors.push('label must be a non empty string');
  }

  if ('description' in json && !isNonEmptyString(json.description)) {
    errors.push('description must be a non empty string');
  }

  if ('files' in json) {
    if (!json.files || typeof json.files !== 'object' || Array.isArray(json.files)) {
      errors.push('files must be an object');
    } else {
      const fileKeys = Object.keys(json.files);
      for (const key of fileKeys) {
        if (!['agents', 'claude', 'setup', 'mcp'].includes(key)) {
          errors.push(`files.${key} is not allowed`);
        }
      }
      for (const required of ['agents', 'claude', 'setup', 'mcp']) {
        if (!(required in json.files)) {
          errors.push(`files.${required} is required`);
        } else if (!isNonEmptyString(json.files[required])) {
          errors.push(`files.${required} must be a non empty string`);
        } else {
          const target = path.join(path.dirname(filePath), json.files[required]);
          if (!fs.existsSync(target)) {
            errors.push(`files.${required} points to missing path: ${json.files[required]}`);
          }
        }
      }
    }
  }

  if ('rules_glob' in json && !isNonEmptyString(json.rules_glob)) {
    errors.push('rules_glob must be a non empty string');
  }

  if ('mcp_packages' in json) {
    if (!Array.isArray(json.mcp_packages)) {
      errors.push('mcp_packages must be an array');
    } else {
      json.mcp_packages.forEach((pkg, i) => {
        if (!isNonEmptyString(pkg)) {
          errors.push(`mcp_packages[${i}] must be a non empty string`);
        }
      });
    }
  }

  const kitRoot = path.dirname(filePath);
  const rulesDir = path.join(kitRoot, '.cursor', 'rules');
  if (!fs.existsSync(rulesDir)) {
    errors.push('missing .cursor/rules directory');
  } else {
    const mdc = fs.readdirSync(rulesDir).filter((n) => n.endsWith('.mdc'));
    if (mdc.length === 0) {
      errors.push('no .mdc rules under .cursor/rules');
    }
  }

  return errors.map((e) => `[validator] ${rel} - ${e}`);
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
  const errors = [];

  let kitSchema;
  try {
    kitSchema = JSON.parse(fs.readFileSync(kitSchemaPath, 'utf8'));
  } catch (err) {
    console.error(`[validator] cannot load kit schema: ${err?.message || err}`);
    process.exit(1);
  }

  if (!fs.existsSync(configsRoot)) {
    console.error('[validator] configs/ directory missing');
    process.exit(1);
  }

  const files = walkJsonFiles(configsRoot);

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

    if (path.basename(file) === 'mcp_config.json') {
      const mcpErrors = validateMcpConfig(file, json);
      for (const e of mcpErrors) {
        const msg = `[validator] ${rel} - ${e}`;
        console.error(msg);
        errors.push(msg);
      }
    }

    if (path.basename(file) === 'kit.json') {
      const kitErrors = validateKitJson(file, json, kitSchema);
      for (const e of kitErrors) {
        console.error(e);
        errors.push(e);
      }
    }
  }

  const kitDirs = fs
    .readdirSync(configsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const name of kitDirs) {
    const kitPath = path.join(configsRoot, name, 'kit.json');
    if (!fs.existsSync(kitPath)) {
      const msg = `[validator] configs/${name}/ is missing kit.json`;
      console.error(msg);
      errors.push(msg);
    }
  }

  const passed = errors.length === 0;

  if (passed) {
    console.log('[validator] All config JSON files and kit.json schemas passed.');
  }

  writeOutputs({ passed, errorDetails: errors });

  if (!passed) {
    process.exit(1);
  }
}

main();
