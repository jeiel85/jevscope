# Contributing

## Development principles

1. Keep the core provider-agnostic.
2. Keep credentials server-side.
3. Prefer deterministic local transforms around nondeterministic model calls.
4. Make uncertainty visible instead of hiding it.
5. Every behavior-changing feature should have tests or replay fixtures.
6. No telemetry by default.

## Setup

```bash
pnpm install
pnpm dev
```

## Pull requests

A PR should contain:

- problem statement
- scope / non-scope
- screenshots for UI changes
- tests for logic changes
- migration note for `.jevscope.json` schema changes
- privacy/security impact if applicable

## Commit style

Recommended:

```text
feat(studio): add decision probability inspector
fix(core): validate score criteria length
docs(architecture): clarify provider boundary
test(evaluator): cover threshold edges
```

## Schema evolution

Never silently reinterpret an existing project field.
If the format changes, bump `schemaVersion` and provide a migration path.
