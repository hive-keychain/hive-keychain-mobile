#!/usr/bin/env node
/*
  Update asset import paths after asset reorganization.

  - Builds a mapping from deleted old paths under `src/assets/**` to new paths under `src/assets/images/**`.
  - Uses tail-segment matching to disambiguate (tries 2 segments, then 3, etc.).
  - Applies replacements across TypeScript source files for both `assets/<old>` and `src/assets/<old>` specifiers.

  Usage:
    node scripts/update-asset-imports.js           # dry run, prints mapping and proposed edits
    node scripts/update-asset-imports.js --apply   # writes changes to disk
*/
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

function sh(command) {
  return execSync(command, {encoding: 'utf8'}).trim();
}

function unique(array) {
  return Array.from(new Set(array));
}

function listDeletedAssets() {
  // Use porcelain short status to capture deleted files in working tree
  const out = sh('git status -s || true');
  return out
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('D '))
    .map((l) => l.slice(2).trim())
    .filter(
      (l) =>
        l.startsWith('src/assets/') &&
        (l.endsWith('.svg') || l.endsWith('.png')),
    );
}

function listCurrentAssets() {
  if (!fs.existsSync('src/assets/images')) {
    throw new Error('Expected new assets under src/assets/images');
  }
  const results = [];
  const exts = new Set(['.svg', '.png']);
  function walk(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (exts.has(ext)) results.push(full);
      }
    }
  }
  walk('src/assets/images');
  return results;
}

function endsWithPath(fullPath, tailSegments) {
  const tail = tailSegments.join(path.sep);
  return fullPath === tail || fullPath.endsWith(path.sep + tail);
}

function computeMapping(deletedPaths, currentPaths) {
  const mapping = new Map(); // oldTail -> newFullPath
  const ambiguous = new Set();
  const currentByBasename = new Map();
  for (const p of currentPaths) {
    const base = path.basename(p);
    const arr = currentByBasename.get(base) || [];
    arr.push(p);
    currentByBasename.set(base, arr);
  }

  for (const oldFull of deletedPaths) {
    const afterRoot = oldFull.replace(/^src\/(assets)\//, '');
    const oldSegments = afterRoot.split('/');
    // Try matching by increasing tail length (2, 3, ... up to all), then fallback to basename
    let chosen = null;
    for (
      let tailLen = Math.min(2, oldSegments.length);
      tailLen <= oldSegments.length;
      tailLen++
    ) {
      const tail = oldSegments.slice(-tailLen);
      const matches = currentPaths.filter((p) => endsWithPath(p, tail));
      if (matches.length === 1) {
        chosen = matches[0];
        break;
      }
      if (matches.length > 1) {
        // ambiguous for this tail length; keep trying with a longer tail
      }
    }
    if (!chosen) {
      // Fallback: basename only if unique
      const base = path.basename(oldFull);
      const arr = currentByBasename.get(base) || [];
      if (arr.length === 1) {
        chosen = arr[0];
      }
    }
    if (chosen) {
      mapping.set(afterRoot, chosen);
    } else {
      ambiguous.add(oldFull);
    }
  }

  return {mapping, ambiguous: Array.from(ambiguous)};
}

function buildSpecifierEdits(mapping) {
  // Convert mapping of oldTail (relative to src/assets) -> newFullPath to string specifier mapping
  // We will standardize new specifiers to the tsconfig alias: assets/images/<...>
  const edits = new Map(); // oldSpecifier -> newSpecifier
  for (const [oldTail, newFull] of mapping.entries()) {
    const newRel = newFull.replace(/^src\//, ''); // assets/images/...
    const newAlias = newRel.startsWith('assets/')
      ? newRel
      : 'assets/' + newRel.replace(/^assets\//, '');

    // Old code may import using either 'assets/<oldTail>' or 'src/assets/<oldTail>'
    const oldAlias1 = 'assets/' + oldTail;
    const oldAlias2 = 'src/assets/' + oldTail;
    edits.set(oldAlias1, newAlias);
    edits.set(oldAlias2, newAlias);
  }
  return edits;
}

function applyEditsToFile(filePath, specifierEdits) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;

  for (const [oldSpec, newSpec] of specifierEdits.entries()) {
    // Replace only inside string literals commonly used in import/require
    // We perform a conservative global replace of exact substrings inside quotes
    const patterns = [
      new RegExp(
        `(['"])` + oldSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + `\\1`,
        'g',
      ),
      new RegExp(oldSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    ];
    for (const re of patterns) {
      updated = updated.replace(re, (m) => m.replace(oldSpec, newSpec));
    }
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const isApply = process.argv.includes('--apply');
  const deleted = listDeletedAssets();
  const current = listCurrentAssets();
  const {mapping, ambiguous} = computeMapping(deleted, current);

  const specifierEdits = buildSpecifierEdits(mapping);

  console.log(`Found ${deleted.length} deleted asset paths.`);
  console.log(
    `Resolved ${mapping.size} mappings. Ambiguous/unresolved: ${ambiguous.length}`,
  );
  if (ambiguous.length) {
    console.log('Unresolved examples (up to 20):');
    ambiguous.slice(0, 20).forEach((p) => console.log(' - ' + p));
  }

  console.log('\nSample mappings (up to 20):');
  let i = 0;
  for (const [oldTail, newFull] of mapping.entries()) {
    if (i++ >= 20) break;
    const newRel = newFull.replace(/^src\//, '');
    const newAlias = newRel.startsWith('assets/')
      ? newRel
      : 'assets/' + newRel.replace(/^assets\//, '');
    console.log(`  assets/${oldTail}  ->  ${newAlias}`);
  }

  if (!isApply) {
    console.log('\nDry run. To apply changes, pass --apply');
    return;
  }

  // Apply edits across src/**/*.ts,tsx
  const files = [];
  (function walk(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        if (full.endsWith('.ts') || full.endsWith('.tsx')) files.push(full);
      }
    }
  })('src');
  let changed = 0;
  for (const f of files) {
    const did = applyEditsToFile(f, specifierEdits);
    if (did) changed++;
  }
  console.log(`\nApplied edits to ${changed} files.`);
}

try {
  main();
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
