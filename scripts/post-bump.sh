#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET_BRANCH="master"
VERSION="$(node -p "require('./package.json').version")"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "Generating native projects for v$VERSION..."
npx expo prebuild --clean

git add -A
git commit -m "v$VERSION"
git tag "v$VERSION"
git push -u origin "$CURRENT_BRANCH"
git push --tags

if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
  echo "Version bumped on $TARGET_BRANCH; skipping PR creation."
  exit 0
fi

EXISTING_PR_NUMBER="$(gh pr list --head "$CURRENT_BRANCH" --base "$TARGET_BRANCH" --state open --json number --jq '.[0].number // empty')"

if [ -n "$EXISTING_PR_NUMBER" ]; then
  echo "PR #$EXISTING_PR_NUMBER already exists for $CURRENT_BRANCH -> $TARGET_BRANCH."
  exit 0
fi

gh pr create \
  --base "$TARGET_BRANCH" \
  --head "$CURRENT_BRANCH" \
  --title "Release v$VERSION" \
  --body "Automated version bump PR for v$VERSION."
