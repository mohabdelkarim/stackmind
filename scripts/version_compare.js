/**
 * Compare npm package versions without treating calendar pins as older than semver "latest".
 * Example: current 2026.8.31 must not "update" to latest 2.3.0.
 */

export function parseVersion(raw) {
  const v = String(raw || '').trim();
  const cal = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/.exec(v);
  if (cal) {
    return { scheme: 'cal', major: Number(cal[1]), minor: Number(cal[2]), patch: Number(cal[3]) };
  }
  const sem = /^v?(\d+)\.(\d+)\.(\d+)/.exec(v);
  if (sem) {
    return { scheme: 'sem', major: Number(sem[1]), minor: Number(sem[2]), patch: Number(sem[3]) };
  }
  return null;
}

/**
 * @returns {boolean} true only when candidate is a real upgrade from current
 */
export function isNewer(candidate, current) {
  if (!candidate || !current || candidate === current) return false;

  const a = parseVersion(candidate);
  const b = parseVersion(current);
  if (!a || !b) {
    // Unknown shapes: never auto-change (safer than blind latest).
    return false;
  }

  if (a.scheme !== b.scheme) {
    // Never replace a calendar pin with a semver tag that npm marks latest.
    if (b.scheme === 'cal' && a.scheme === 'sem') return false;
    // Allow moving a semver pin forward onto a calendar release line.
    if (b.scheme === 'sem' && a.scheme === 'cal') return true;
  }

  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  return a.patch > b.patch;
}

export function selfCheck() {
  const cases = [
    ['2.6.1', '2.5.1', true],
    ['2.5.1', '2.6.1', false],
    ['2.3.0', '2026.8.31', false],
    ['2026.8.31', '2026.7.10', true],
    ['2026.7.10', '2026.8.31', false],
    ['2026.8.31', '2.3.0', true],
    ['0.3.4', '0.3.3', true],
    ['0.3.3', '0.3.3', false],
  ];
  const failed = [];
  for (const [cand, cur, expect] of cases) {
    const got = isNewer(cand, cur);
    if (got !== expect) failed.push(`${cand} vs ${cur}: got ${got}, want ${expect}`);
  }
  return failed;
}
