# Evaluation Engine

## Goals

The evaluator turns model calls into reproducible engineering evidence.

## Single run

Input:

```ts
type EvaluationRequest = {
  state: JsonValue;
  questions: Record<string, QuestionDefinition>;
  model?: string;
};
```

Output must preserve:

- provider
- model
- answers
- usage
- latency
- timestamp
- raw response (optional debug storage)

## Batch execution

Algorithm:

1. parse JSONL
2. validate every case before network calls
3. queue valid cases
4. execute with bounded concurrency
5. collect result/error per case
6. apply local policy
7. evaluate expectations
8. aggregate report

Default concurrency recommendation: `4`.

Do not use unbounded `Promise.all` for large datasets.

## Metrics

Per batch:

- total cases
- completed
- failed
- changed (compare mode)
- expectation pass/fail
- average latency
- p50 / p95 latency
- average confidence by question
- low-confidence count
- policy bucket distribution

## Choice comparison

For each named choice question:

```text
same decision?
confidence A
confidence B
delta
policy bucket A
policy bucket B
```

## Score comparison

Compare:

- expected score delta
- confidence delta
- distribution shift
- expectation pass/fail

Do not compare rounded score labels only.

## Noul comparison

Compare raw YES probability.

Useful derived fields:

```text
delta = pB - pA
crossedYesThreshold
crossedNoThreshold
changedPolicyBucket
```

## Regression expectations

Expectation evaluation must be deterministic and local.

Supported v0.1 assertions:

- `choiceEquals`
- `choiceOneOf`
- `minConfidence`
- `scoreMin`
- `scoreMax`
- `scoreApprox` + tolerance
- `noulMin`
- `noulMax`

## Reproducibility caveat

A remote probabilistic model/service may change behavior over time, especially when using an alias such as `jev-latest`.

Every result record therefore stores the returned model identifier.
For strict historical reproduction, use an immutable model identifier when the provider offers one.
