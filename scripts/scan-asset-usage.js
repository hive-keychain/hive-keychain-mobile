/*
  Scans src/assets (excluding fonts) and checks usage across the repository.
  Outputs builds/asset-usage-report.json with per-asset usage details.
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSETS_ROOT = path.join(PROJECT_ROOT, 'src', 'assets');
const OUTPUT_FILE = path.join(
  PROJECT_ROOT,
  'builds',
  'asset-usage-report.json',
);

const ASSET_EXTENSIONS = new Set([
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.avif',
]);
const CODE_FILE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.xml',
  '.gradle',
  '.properties',
  '.plist',
]);

const IGNORED_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  'ios',
  'android',
  'build',
  'builds',
  '.expo',
  '.expo-shared',
  '.gradle',
  '.idea',
  'Pods',
]);

function isDirectory(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (e) {
    return false;
  }
}

async function walkDir(
  startDir,
  {includeExtensions, ignoreDirs = new Set(), excludeSubdirPredicate = null},
) {
  const results = [];
  async function walk(currentDir) {
    const entries = await fsp.readdir(currentDir, {withFileTypes: true});
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) continue;
        if (excludeSubdirPredicate && excludeSubdirPredicate(fullPath))
          continue;
        await walk(fullPath);
      } else if (entry.isFile()) {
        if (includeExtensions && includeExtensions.size > 0) {
          const ext = path.extname(entry.name).toLowerCase();
          if (!includeExtensions.has(ext)) continue;
        }
        results.push(fullPath);
      }
    }
  }
  await walk(startDir);
  return results;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function getRelativeFromProject(p) {
  return toPosix(path.relative(PROJECT_ROOT, p));
}

function getRelativeFromAssets(p) {
  return toPosix(path.relative(ASSETS_ROOT, p));
}

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await fsp.mkdir(dir, {recursive: true});
}

async function readTextFile(filePath) {
  try {
    return await fsp.readFile(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

function findTokenLineNumbers(content, token) {
  const lines = content.split(/\r?\n/);
  const matches = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(token)) {
      matches.push(i + 1);
    }
  }
  return matches;
}

async function main() {
  const startedAt = Date.now();

  if (!isDirectory(ASSETS_ROOT)) {
    console.error('Could not find src/assets directory at', ASSETS_ROOT);
    process.exit(1);
  }

  // 1) Collect assets (exclude fonts subdir)
  const assetFiles = (
    await walkDir(ASSETS_ROOT, {
      includeExtensions: ASSET_EXTENSIONS,
      ignoreDirs: new Set(),
      excludeSubdirPredicate: (fullDirPath) =>
        toPosix(fullDirPath).includes('/fonts'),
    })
  )
    .filter((p) => !toPosix(p).includes('/fonts/'))
    .sort();

  // 2) Collect code files to scan (exclude heavy dirs and assets themselves)
  const codeFiles = (
    await walkDir(PROJECT_ROOT, {
      includeExtensions: CODE_FILE_EXTENSIONS,
      ignoreDirs: IGNORED_DIR_NAMES,
    })
  )
    .filter((p) => !toPosix(p).includes('/src/assets/'))
    .sort();

  // 3) Preload file contents to reduce disk churn
  const fileContentsCache = new Map();
  for (const filePath of codeFiles) {
    const content = await readTextFile(filePath);
    fileContentsCache.set(filePath, content);
  }

  // 4) For each asset, look for usage
  const report = [];
  let usedCount = 0;

  for (const assetAbsPath of assetFiles) {
    const relFromAssets = getRelativeFromAssets(assetAbsPath);
    const relFromProject = getRelativeFromProject(assetAbsPath);
    const baseName = path.basename(assetAbsPath);

    // Candidate tokens to search for
    const tokens = new Set();
    tokens.add(`assets/${relFromAssets}`); // alias or relative paths
    tokens.add(`src/assets/${relFromAssets}`);
    tokens.add(baseName);

    const matches = [];

    for (const [filePath, content] of fileContentsCache.entries()) {
      let fileMatched = false;
      let lineSet = new Set();
      for (const token of tokens) {
        if (content.includes(token)) {
          fileMatched = true;
          const lines = findTokenLineNumbers(content, token);
          lines.forEach((ln) => lineSet.add(ln));
        }
      }
      if (fileMatched) {
        matches.push({
          file: getRelativeFromProject(filePath),
          lines: Array.from(lineSet).sort((a, b) => a - b),
        });
      }
    }

    const used = matches.length > 0;
    if (used) usedCount += 1;
    report.push({
      asset: relFromProject,
      used,
      matchCount: matches.length,
      matches,
      searchTokens: Array.from(tokens),
    });
  }

  await ensureDir(OUTPUT_FILE);
  await fsp.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        projectRoot: getRelativeFromProject(PROJECT_ROOT) || '.',
        assetsRoot: getRelativeFromProject(ASSETS_ROOT),
        scannedAt: new Date().toISOString(),
        totals: {
          assets: report.length,
          used: usedCount,
          unused: report.length - usedCount,
          codeFilesScanned: codeFiles.length,
        },
        report,
      },
      null,
      2,
    ),
    'utf8',
  );

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log(
    `Asset usage report written to ${getRelativeFromProject(OUTPUT_FILE)}`,
  );
  console.log(
    `Assets: ${report.length} | Used: ${usedCount} | Unused: ${
      report.length - usedCount
    } | Code files scanned: ${codeFiles.length} | Time: ${elapsed}s`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
