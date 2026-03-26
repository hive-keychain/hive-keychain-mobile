#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET_BRANCH="master"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree must be clean before running a version bump." >&2
  exit 1
fi

if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo "GitHub CLI (gh) is required to create the release PR." >&2
    exit 1
  fi

  if ! gh auth status >/dev/null 2>&1; then
    echo "GitHub CLI is not authenticated. Run 'gh auth login' before bumping." >&2
    exit 1
  fi
fi

echo "Running release checks..."
npm run test:ci

echo "Validating Expo prebuild config..."
npx expo config --type prebuild >/dev/null
