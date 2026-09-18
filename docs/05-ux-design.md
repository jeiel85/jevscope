# UX Design

## Primary desktop layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ JevScope   Project ▼   Run ▶   Batch   Compare   History      Settings │
├───────────────────────┬────────────────────────┬─────────────────────────┤
│ STATE                 │ QUESTIONS              │ RESULT                  │
│                       │                        │                         │
│ JSON editor           │ nextAction             │ nextAction              │
│                       │ Choice                 │ RETREAT  0.81           │
│                       │ criteria editor        │ ████████████████        │
│                       │                        │                         │
│                       │ danger                 │ attack   0.19           │
│                       │ Score                  │                         │
│                       │                        │ Policy: REVIEW/AUTO      │
├───────────────────────┴────────────────────────┴─────────────────────────┤
│ Run details: provider · model · latency · token usage · timestamp       │
└──────────────────────────────────────────────────────────────────────────┘
```

## Screens

### 1. Workbench

Purpose: edit and run one case.

Required:

- state editor
- question list/editor
- schema errors inline
- run button
- result inspector
- raw response drawer
- policy result badge

### 2. Batch

Purpose: evaluate a case set.

Columns:

- case ID
- status
- answer summary
- confidence
- policy bucket
- latency
- expectation status

Controls:

- concurrency
- stop
- retry failed
- export report

### 3. Compare

Inputs:

- Variant A project
- Variant B project
- shared cases

Outputs:

- changed decisions
- confidence delta
- policy-bucket delta
- expectation delta
- filter to changed only

Avoid declaring a “winner” unless user supplied explicit expected outcomes.

### 4. History

Local history:

- timestamp
- project fingerprint
- state fingerprint
- provider/model
- latency
- answers
- policy result

Default: local-only; user can clear all.

## Visual language

- dark-first developer-tool aesthetic
- monospace for state/raw JSON
- normal UI font for labels
- probabilities as bars + numeric values
- never encode pass/fail only by color
- show confidence to at least 2 decimals; raw value available
- keyboard-first interaction

## Accessibility

- WCAG AA contrast target
- semantic buttons/table headings
- focus-visible states
- probability bars include text equivalents
- full keyboard operation
- no animation required to understand result changes

## Empty/error states

Examples:

- no API key: explain server configuration, not browser key entry
- invalid project: show exact schema path
- provider error: preserve local edits and show retry option
- batch partial failure: show successful rows and failed rows separately
