# Testing Strategy

## Test pyramid

### Unit tests

`@jevscope/core`

- schema validation
- question constraints
- confidence thresholds
- policy edge cases
- schema migrations

`@jevscope/evaluator`

- percentile calculation
- batch aggregation
- expectation assertions
- compare logic
- concurrency limiter

### Contract tests

Provider mock fixtures verify that normalization preserves:

- choice confidence/probabilities
- score expected value/confidence/distribution
- noul probability
- model
- usage

### API tests

- invalid JSON
- oversized body
- missing key/config
- malformed question
- provider timeout
- sanitized error

### UI tests

Critical flows:

1. load example
2. edit state
3. run
4. inspect result
5. import JSONL
6. compare variants

## Live integration tests

Disabled in normal CI.

Opt-in:

```bash
TYPESAFE_API_KEY=... pnpm test:live
```

Never make public PR CI depend on a paid/provider credential.

## Golden fixtures

Store mocked provider responses under test fixtures.
Do not record real sensitive states.

## Definition of Done

A v0.1 feature is done when:

- behavior implemented
- unit/contract tests added
- error state handled
- docs updated
- privacy implications reviewed
