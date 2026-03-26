# Master Contract

This is the highest-precedence repo-specific instruction set for AI agents working in `hive-keychain-mobile`.

## 1. Mission

- Make the smallest safe change that fully solves the requested problem.
- Optimize for security, correctness, maintainability, and clarity in that order.
- Avoid code creep, speculative abstractions, and parallel implementations.

## 2. Repo Profile

- Mobile app stack: Expo SDK 54, React 19, React Native 0.81.
- State and data flow: Redux 5, `redux-thunk`, `redux-persist`, typed hooks in `src/hooks/redux.ts`.
- Navigation: React Navigation 7.
- TypeScript: `strict: true`, `strictNullChecks: false`, alias-based imports from `tsconfig.json` and `babel.config.js`.
- Tests: Jest, `ts-jest`, React Native Testing Library, setup in `jest.setup.js`.

## 3. Scope Rules

- Implement only what the user asked for.
- Do not silently bundle refactors, renames, formatting sweeps, or dependency churn into unrelated work.
- Prefer editing an existing module over introducing a new abstraction or directory.
- If a task suggests a product or security trade-off, stop and ask instead of guessing.

## 4. Security-Critical Boundaries

- Treat `auth`, secure storage, keychain access, signing flows, browser request operations, HAS flows, and app config/env handling as high-risk surfaces.
- Never log or persist secrets, master keys, private keys, memo keys, raw signing payloads, auth tokens, or sensitive account state.
- Preserve the guarantees of `src/store/index.ts`, especially the persist whitelist and `getSafeState()` redaction behavior.
- Treat browser, WebView, deep link, and HAS inputs as untrusted data. Validate, sanitize, and fail closed.
- Prefer minimal disclosure in errors. Do not add debug output that could expose payloads or security state.

## 5. Architecture Rules

- Follow the existing app structure under `src/actions`, `src/reducers`, `src/components`, `src/screens`, `src/hooks`, `src/utils`, `src/api`, and `src/navigators`.
- Keep Redux patterns consistent:
  - action constants live in `src/actions/types.ts`
  - thunk/action creators are usually named exports
  - reducers default-export a reducer and are registered in `src/reducers/index.ts`
- Use `useAppDispatch()` and `useAppSelector()` from `src/hooks/redux.ts` instead of untyped Redux hooks.
- Reuse the existing import aliases such as `actions/*`, `components/*`, `utils/*`, `store`, and `src/*`.
- Do not move provider-specific or transport-specific logic into general UI components unless the current architecture already requires it.

## 6. Naming And File Conventions

- Match the established naming already in the repo instead of normalizing everything at once.
- Common patterns in this codebase:
  - hooks: `use*.ts` or `use*.tsx`
  - utilities: `*.utils.ts`
  - tests: `*.test.ts` or `*.test.tsx`
  - reducers: one reducer per file, default export
- Components frequently use default exports. Preserve the local convention in touched files unless there is a strong reason not to.
- Keep files focused and cohesive. Prefer staying under 250 lines when practical.

## 7. Dependency And Abstraction Rules

- Do not add a dependency unless the current stack cannot solve the problem cleanly.
- Prefer platform APIs, current dependencies, or small local code over tiny helper packages.
- Do not introduce vague layers such as `manager`, `helper`, `processor`, or generic `utils` modules without a clear repeated need.
- Refactor only when it reduces duplication or clarifies a real boundary used more than once.

## 8. Quality Gates

- Behavior changes should include or update tests when feasible.
- Put tests next to the relevant layer using the repo's `__tests__` and `*.test.ts(x)` conventions.
- If new native or Expo modules affect tests, extend `jest.setup.js` mocks intentionally.
- Run focused validation for changed areas when possible. Prefer targeted tests over broad, slow sweeps unless the task justifies it.

## 9. Documentation Rules

- Document security assumptions, invariants, and non-obvious behavior near the code they protect.
- Comments should explain why a boundary exists, not restate the code.
- Update docs when behavior, setup, or agent guidance materially changes.

## 10. Default Decision Rule

- Prefer the clearer change over the clever one.
- Prefer the narrower change over the broader one.
- Prefer asking a question over inventing product behavior.
