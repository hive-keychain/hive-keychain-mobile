# AGENTS.md

Repo-specific operating guide for AI coding agents in `hive-keychain-mobile`.

Read `docs/MASTER-CONTRACT.md` first. If guidance conflicts, follow:

1. `docs/MASTER-CONTRACT.md`
2. this file
3. narrower file-specific rules in `.cursor/rules/`

## Working Principles

- Keep changes minimal, cohesive, and directly tied to the request.
- Prioritize security, correctness, and code quality over speed.
- Do not add code paths, abstractions, or dependencies without a current need.
- Do not weaken existing trust boundaries around auth, storage, signing, browser requests, or app configuration.

## Repo Conventions

- The app uses Expo, React Native, React, Redux, `redux-thunk`, and alias-based imports.
- Follow the current folder layout under `src/` instead of introducing new top-level patterns.
- Respect existing Redux conventions:
  - action constants in `src/actions/types.ts`
  - named thunk/action exports
  - default-export reducers registered in `src/reducers/index.ts`
- Prefer typed Redux hooks from `src/hooks/redux.ts`.
- Match local naming patterns such as `use*.ts`, `*.utils.ts`, and `*.test.ts(x)`.
- Preserve the export style of the file you are editing unless there is a compelling reason to change it.

## Security Rules

- Never log or persist keys, master keys, sensitive account state, raw signing payloads, or session secrets.
- Preserve the redaction and persistence boundaries in `src/store/index.ts`.
- Treat browser, WebView, deep link, and HAS input as untrusted.
- Fail safely and avoid debug output that exposes sensitive state.

## Quality Rules

- Prefer modifying an existing module over creating a new layer.
- Keep files focused; split only when it clarifies a real boundary.
- Add or update tests for behavior changes when feasible.
- Extend `jest.setup.js` intentionally when new mocks are needed.
- Leave nearby code and docs clearer than you found them.

## When Unsure

- Ask before making product, architecture, or security assumptions.
