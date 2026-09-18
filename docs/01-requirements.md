# Requirements

## Functional requirements

### Project

- FR-001 Load a `.jevscope.json` project.
- FR-002 Validate schema before execution.
- FR-003 Edit state and questions.
- FR-004 Support `choice`, `score`, and `noul`.
- FR-005 Save/export project JSON.
- FR-006 Keep API credentials outside project files.

### Single evaluation

- FR-010 Execute one state against one or more named questions.
- FR-011 Display model name and token usage when provided.
- FR-012 Display `choice` selected label, confidence, and per-label probabilities.
- FR-013 Display `score` expected score, confidence, legend, and per-level probabilities.
- FR-014 Display `noul` as probability of YES; derive YES/NO only through an explicit local threshold/policy.
- FR-015 Show request latency measured by JevScope.
- FR-016 Preserve raw provider result for debugging.

### Confidence policy

- FR-020 Define thresholds for `auto`, `review`, and `fallback`.
- FR-021 Classify a result deterministically from the result metric.
- FR-022 Never imply Jev itself made the `auto/review/fallback` decision unless that was an explicit Jev question.

### Batch/replay

- FR-030 Import JSONL cases.
- FR-031 Execute cases with bounded concurrency.
- FR-032 Capture per-case result/error/latency.
- FR-033 Calculate summary metrics.
- FR-034 Retry only explicitly retryable provider failures.

### Compare

- FR-040 Run the same cases against A and B project definitions.
- FR-041 Show decision changes.
- FR-042 Show confidence movement.
- FR-043 Show threshold-bucket changes.
- FR-044 Do not label one variant “better” without explicit expected outcomes.

### Regression

- FR-050 Optional expected answers per case.
- FR-051 Report pass/fail by named expectation.
- FR-052 Support tolerant score checks.
- FR-053 Support minimum-confidence assertions.

## Non-functional requirements

- NFR-001 Node.js 20+.
- NFR-002 TypeScript strict mode.
- NFR-003 No API key shipped to the browser.
- NFR-004 No telemetry in v0.1.
- NFR-005 Imported files are treated as untrusted data.
- NFR-006 Default request body limit: 1 MiB.
- NFR-007 Batch concurrency is bounded and configurable.
- NFR-008 Core policy/evaluation logic is unit-testable without network access.
- NFR-009 Provider tests use mocks by default; live tests are opt-in.
- NFR-010 Schema changes are versioned.

## Out of scope

- arbitrary shell/tool execution
- shared cloud workspaces
- billing/accounts
- secrets vault
- autonomous deployment
