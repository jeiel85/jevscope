# Implementation Plan

## Phase A — Foundation

### A1. Schema

Implement and test:

- project schema v1
- question schemas
- policy schema
- case JSONL schema
- expectation schema

Acceptance:

- invalid Choice with <2 labels is rejected
- invalid Score with <2 levels is rejected
- empty question map is rejected
- `noul` semantics are documented and preserved

### A2. Provider

- construct TypeSafe client server-side
- map project request 1:1 to System One request
- preserve response fields
- normalize provider exceptions

Acceptance:

- browser bundle contains no API key
- missing key produces configuration error
- mocked provider contract tests pass

### A3. API

- health endpoint
- evaluate endpoint
- request size limit
- local CORS
- abort/timeout support
- sanitized logging

## Phase B — Workbench

### B1. Editors

- JSON state editor
- structured question editor
- project open/save
- example loader

### B2. Inspector

Implement separate renderers:

- `ChoiceResult`
- `ScoreResult`
- `NoulResult`

Never use one generic result card that hides primitive-specific semantics.

### B3. Policy

- choice confidence buckets
- score confidence buckets
- noul yes/review/no buckets
- threshold controls
- display raw metric beside derived policy

## Phase C — Evaluation

### C1. History

IndexedDB entity:

```ts
type RunRecord = {
  id: string;
  createdAt: string;
  projectHash: string;
  stateHash: string;
  request: EvaluationRequest;
  result?: EvaluationResult;
  error?: EvaluationError;
};
```

### C2. Batch

- JSONL importer
- validation report before execution
- bounded concurrency
- stop/abort
- summary metrics

### C3. Compare

- A/B project loader
- same case set
- changed-decision filter
- confidence delta
- expectation delta

## Phase D — Open-source polish

- docs screenshots
- demo GIF
- issue templates
- contribution guide
- first release
- submit to Jev community directories after stable demo exists
