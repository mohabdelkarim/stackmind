#!/usr/bin/env node
/**
 * Deterministic kit eval harness.
 * Scores whether each stack kit contains the guidance an agent needs
 * for fixed prompts (before = empty corpus fails; after = kit corpus passes).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const configsRoot = path.join(root, 'configs');
const casesDir = path.join(__dirname, 'cases');

function walkFiles(dir, pred) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, pred));
    else if (pred(full)) out.push(full);
  }
  return out;
}

function loadCorpus(stackId) {
  const kitRoot = path.join(configsRoot, stackId);
  if (!fs.existsSync(kitRoot)) return '';
  const files = walkFiles(kitRoot, (p) => {
    const base = path.basename(p);
    return (
      base.endsWith('.md') ||
      base.endsWith('.mdc') ||
      base === 'kit.json'
    );
  });
  return files.map((f) => fs.readFileSync(f, 'utf8')).join('\n\n');
}

function score(corpus, mustContain) {
  const missing = [];
  for (const needle of mustContain) {
    if (!corpus.toLowerCase().includes(String(needle).toLowerCase())) {
      missing.push(needle);
    }
  }
  return { pass: missing.length === 0, missing };
}

function main() {
  const caseFiles = fs
    .readdirSync(casesDir)
    .filter((n) => n.endsWith('.json'))
    .sort();

  if (caseFiles.length === 0) {
    console.error('[eval] no cases in evals/cases');
    process.exit(1);
  }

  let failed = 0;
  let passed = 0;

  console.log('[eval] before/after kit coverage\n');

  for (const name of caseFiles) {
    const spec = JSON.parse(fs.readFileSync(path.join(casesDir, name), 'utf8'));
    const before = score('', spec.must_contain);
    const after = score(loadCorpus(spec.stack), spec.must_contain);

    const beforeOk = !before.pass;
    const afterOk = after.pass;

    if (!beforeOk) {
      console.error(`  [fail] ${name}: BEFORE should miss guidance but matched all needles`);
      failed += 1;
      continue;
    }
    if (!afterOk) {
      console.error(
        `  [fail] ${name}: AFTER missing: ${after.missing.join(', ')} (prompt: ${spec.prompt})`,
      );
      failed += 1;
      continue;
    }

    console.log(`  [ok] ${name} (${spec.stack}) before=miss after=hit`);
    passed += 1;
  }

  console.log(`\n[eval] ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
