/**
 * Shared MCP config shape rules for stackmind kits.
 * Cursor resolves ${env:NAME} and ${workspaceFolder} in command/args/env.
 * Official MCP servers expect postgres DSN and filesystem roots as CLI args.
 */

const FAKE_ENV_KEYS = new Set(['POSTGRES_DSN', 'MCP_FS_ROOT', 'GITHUB_TOKEN']);

const SECRET_LITERAL =
  /\b(sk_live_|sk_test_|rk_live_|rk_test_|sbp_|ghp_|github_pat_|ntn_[A-Za-z0-9]{20,}|postgresql:\/\/[^/\s]+:[^/\s]+@)/i;

export function packageArgIndex(args) {
  if (!Array.isArray(args)) return -1;
  return args.findIndex(
    (a) => typeof a === 'string' && (a.startsWith('@') || a.includes('/')),
  );
}

export function hasNpxYes(args) {
  if (!Array.isArray(args)) return false;
  const pkgIdx = packageArgIndex(args);
  if (pkgIdx < 0) return args.includes('-y');
  return args.slice(0, pkgIdx).includes('-y');
}

export function pinnedPackage(args) {
  const idx = packageArgIndex(args);
  if (idx < 0) return null;
  const raw = args[idx];
  const m = String(raw).match(/^(@[^@]+)@([^@]+)$/);
  if (!m) return { name: String(raw), version: null, raw };
  return { name: m[1], version: m[2], raw };
}

function isEnvRef(value) {
  return typeof value === 'string' && /^\$\{env:[A-Z][A-Z0-9_]*\}$/.test(value);
}

function isWorkspaceFolder(value) {
  return value === '${workspaceFolder}';
}

/**
 * @param {object} json parsed mcp_config.json (or { mcpServers })
 * @param {{ fileLabel?: string }} opts
 * @returns {string[]} error messages
 */
export function validateMcpServersShape(json, opts = {}) {
  const label = opts.fileLabel || 'mcp config';
  const errors = [];

  if (!json || typeof json !== 'object' || !json.mcpServers || typeof json.mcpServers !== 'object') {
    errors.push(`${label}: missing mcpServers object`);
    return errors;
  }

  for (const [name, server] of Object.entries(json.mcpServers)) {
    if (!server || typeof server !== 'object') {
      errors.push(`${label}: server "${name}" must be an object`);
      continue;
    }

    if (server.command !== 'npx') {
      // Allow non-npx later; still scan env for secrets / fake keys.
    } else {
      const args = server.args;
      if (!Array.isArray(args) || args.length === 0) {
        errors.push(`${label}: server "${name}" needs non-empty args`);
        continue;
      }
      if (!hasNpxYes(args)) {
        errors.push(`${label}: server "${name}" must pass npx -y before the package`);
      }
      const pinned = pinnedPackage(args);
      if (!pinned || !pinned.version) {
        errors.push(
          `${label}: server "${name}" package must be pinned as @scope/name@version`,
        );
      }

      if (name === 'postgres' || (pinned && pinned.name === '@modelcontextprotocol/server-postgres')) {
        const pkgIdx = packageArgIndex(args);
        const dsn = pkgIdx >= 0 ? args[pkgIdx + 1] : null;
        if (!dsn || typeof dsn !== 'string') {
          errors.push(
            `${label}: postgres must pass the connection string as the arg after the package`,
          );
        } else if (!isEnvRef(dsn) && !/^postgres(ql)?:\/\//i.test(dsn)) {
          errors.push(
            `${label}: postgres DSN arg must be \${env:DATABASE_URL} (or \${env:POSTGRES_DSN})`,
          );
        } else if (SECRET_LITERAL.test(dsn)) {
          errors.push(`${label}: postgres DSN must not embed credentials in the kit`);
        }
      }

      if (
        name === 'filesystem' ||
        (pinned && pinned.name === '@modelcontextprotocol/server-filesystem')
      ) {
        const pkgIdx = packageArgIndex(args);
        const root = pkgIdx >= 0 ? args[pkgIdx + 1] : null;
        if (!root || typeof root !== 'string') {
          errors.push(
            `${label}: filesystem must pass an allowed directory arg after the package`,
          );
        } else if (!isWorkspaceFolder(root) && root !== '.' && !root.includes('${workspaceFolder}')) {
          errors.push(
            `${label}: filesystem root should be \${workspaceFolder} (Cursor project root)`,
          );
        }
      }

      if (
        name === 'github' ||
        (pinned && pinned.name === '@modelcontextprotocol/server-github')
      ) {
        const env = server.env || {};
        if (!Object.prototype.hasOwnProperty.call(env, 'GITHUB_PERSONAL_ACCESS_TOKEN')) {
          errors.push(
            `${label}: github must set env.GITHUB_PERSONAL_ACCESS_TOKEN (not GITHUB_TOKEN)`,
          );
        }
      }
    }

    const env = server.env;
    if (env && typeof env === 'object') {
      for (const [key, value] of Object.entries(env)) {
        if (FAKE_ENV_KEYS.has(key)) {
          errors.push(
            `${label}: server "${name}" uses unsupported/misleading env key "${key}"`,
          );
        }
        if (typeof value === 'string') {
          if (SECRET_LITERAL.test(value)) {
            errors.push(`${label}: server "${name}" env.${key} looks like a committed secret`);
          }
          if (value.includes('${') && !isEnvRef(value) && !value.includes('${workspaceFolder}')) {
            errors.push(
              `${label}: server "${name}" env.${key} must use Cursor form \${env:NAME}`,
            );
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Validate a snippet file shaped as { name, config: { command, args, env } }.
 */
export function validateMcpSnippetShape(json, opts = {}) {
  const label = opts.fileLabel || 'mcp snippet';
  if (!json || typeof json !== 'object' || !json.config) {
    return [`${label}: missing config object`];
  }
  const name = json.name || 'snippet';
  return validateMcpServersShape({ mcpServers: { [name]: json.config } }, { fileLabel: label });
}
