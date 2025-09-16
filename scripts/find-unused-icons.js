/*
  Finds unused Icons enum members and optionally removes them from src/enums/icons.enum.ts

  Usage:
    node scripts/find-unused-icons.js           # list unused
    node scripts/find-unused-icons.js --apply   # remove unused from enum file
    node scripts/find-unused-icons.js --json    # output machine-readable JSON

  Notes:
  - Scans .ts and .tsx files, excluding the enum file itself
  - Looks for textual references like `Icons.NAME`
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENUM_FILE = path.join(PROJECT_ROOT, 'src', 'enums', 'icons.enum.ts');

const CODE_FILE_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'ios',
  'android',
  'build',
  'builds',
  'Pods',
]);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function walkDir(startDir) {
  const results = [];
  async function walk(currentDir) {
    const entries = await fsp.readdir(currentDir, {withFileTypes: true});
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!CODE_FILE_EXTENSIONS.has(ext)) continue;
        if (path.resolve(fullPath) === path.resolve(ENUM_FILE)) continue;
        results.push(fullPath);
      }
    }
  }
  await walk(startDir);
  return results;
}

function parseEnumKeys(enumContent) {
  const keys = [];
  const lines = enumContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const m = trimmed.match(/^([A-Z0-9_]+)\s*=\s*['"]/);
    if (m) keys.push(m[1]);
  }
  return keys;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has('--apply');
  const json = args.has('--json');

  if (!fs.existsSync(ENUM_FILE)) {
    console.error('Enum file not found at', ENUM_FILE);
    process.exit(1);
  }

  const enumContent = await fsp.readFile(ENUM_FILE, 'utf8');
  const allKeys = parseEnumKeys(enumContent);

  const codeFiles = await walkDir(PROJECT_ROOT);
  const contents = await Promise.all(
    codeFiles.map((p) => fsp.readFile(p, 'utf8').then((t) => [p, t])),
  );

  const usedKeys = new Set();
  for (const key of allKeys) {
    const needle = `Icons.${key}`;
    for (const [p, text] of contents) {
      if (text.includes(needle)) {
        usedKeys.add(key);
        break;
      }
    }
  }

  const unusedKeys = allKeys.filter((k) => !usedKeys.has(k));

  if (json) {
    console.log(
      JSON.stringify(
        {
          total: allKeys.length,
          used: Array.from(usedKeys).sort(),
          unused: unusedKeys.sort(),
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`Icons enum members: ${allKeys.length}`);
    console.log(`Used: ${usedKeys.size}`);
    console.log(`Unused: ${unusedKeys.length}`);
    if (unusedKeys.length) {
      console.log('\nUnused keys:');
      for (const k of unusedKeys.sort()) console.log(`- ${k}`);
    }
  }

  if (!apply) return;

  if (unusedKeys.length === 0) {
    console.log('Nothing to remove.');
    return;
  }

  const lines = enumContent.split(/\r?\n/);
  const unusedSet = new Set(unusedKeys);
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    // Drop commented-out enum entries like: // KEY = 'value',
    if (/^\/\/\s*[A-Z0-9_]+\s*=\s*['"][^'"\n]+['"]/i.test(trimmed)) {
      return false;
    }
    const m = trimmed.match(/^([A-Z0-9_]+)\s*=\s*['"]/);
    if (!m) return true;
    const key = m[1];
    return !unusedSet.has(key);
  });

  await fsp.writeFile(ENUM_FILE, filtered.join('\n'), 'utf8');
  console.log(
    `Removed ${unusedKeys.length} unused enum members from ${toPosix(
      path.relative(PROJECT_ROOT, ENUM_FILE),
    )}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
