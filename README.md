# JevScope

**Visual decision debugger, evaluator, and regression testbench for TypeSafe AI Jev.**

JevScope is an open-source local-first developer tool for designing, running, inspecting, replaying, and comparing Jev decision policies.

> Status: architecture/design bundle + runnable starter scaffold (v0.1 foundation)

## Why JevScope

Jev is a System One decision model: structured state goes in, typed `choice`, `score`, and `noul` questions are evaluated, and structured answers/probabilities come out.

That creates a different engineering problem from normal chat-model tooling:

- Is the state representation useful?
- Are the decision labels/rubrics well defined?
- What confidence threshold is safe for automatic action?
- What changed after a question or rubric edit?
- Which cases became low-confidence?
- Did a policy change regress previously accepted behavior?

JevScope treats Jev decision definitions as versionable software artifacts.

## Core workflow

```text
State + Questions
       |
       v
   Jev Provider
       |
       v
Typed Decision Result
       |
       +--> Inspector
       +--> Confidence Policy
       +--> History
       +--> Batch Evaluation
       +--> A/B Compare
       +--> Regression Tests
```

## v0.1 scope

- JSON state editor
- `choice`, `score`, `noul` question definitions
- TypeSafe Jev provider
- secure server-side API-key boundary
- result/probability inspector
- confidence policy classification (`auto`, `review`, `fallback`)
- local run history
- JSONL batch cases
- A/B definition comparison
- regression expectation format
- TypeScript-first monorepo scaffold
- game-AI demo project

## Non-goals for v0.1

- user accounts
- hosted SaaS backend
- telemetry/analytics
- remote database
- prompt marketplace
- generic chat UI
- autonomous execution of external side effects

## Repository layout

```text
apps/
  api/                  # server-side TypeSafe boundary
  studio/               # React/Vite UI starter

packages/
  core/                 # schemas, policy logic, domain types
  evaluator/            # batch/replay/compare utilities
  provider-typesafe/    # Jev adapter

examples/
  game-ai/              # reference project + JSONL cases

docs/
  00-product-brief.md
  01-requirements.md
  02-architecture.md
  03-data-format.md
  04-api-contract.md
  05-ux-design.md
  06-evaluation-engine.md
  07-security-privacy.md
  08-testing-strategy.md
  09-roadmap.md
  10-github-launch-checklist.md
  11-adr-001-provider-boundary.md
  12-adr-002-local-first.md
  13-references.md
```

## Requirements

- Node.js 20+
- pnpm
- TypeSafe API key for live Jev calls

## Start

```bash
cp .env.example .env
# set TYPESAFE_API_KEY

pnpm install
pnpm dev
```

Studio defaults to `http://localhost:5173`.
API defaults to `http://localhost:4317`.

## Validate example project

```bash
pnpm validate:example
```

## Security model

The TypeSafe JS SDK rejects browser usage by default because browser execution can expose API keys. JevScope therefore sends live evaluations through `apps/api`.

Never put `TYPESAFE_API_KEY` in Vite `VITE_*` variables.

See `docs/07-security-privacy.md`.

## Suggested first GitHub milestone

**Milestone: v0.1 — Decision Workbench**

1. Project loader/editor
2. Single-case Jev run
3. result inspector
4. confidence policy
5. local history
6. batch runner
7. compare view
8. regression report
9. game-AI demo
10. docs + first release

## License

MIT. See `LICENSE`.
