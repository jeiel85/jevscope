# Architecture

## Context

The official TypeSafe JavaScript SDK is intended for server-side usage by default and protects against accidental browser key exposure. JevScope therefore uses an explicit backend-for-frontend boundary.

## Runtime architecture

```text
┌──────────────────────────┐
│ Browser: JevScope Studio │
│ React / Vite             │
│                          │
│ - editors                │
│ - visualization          │
│ - local history metadata │
└────────────┬─────────────┘
             │ HTTP localhost / same-origin
             v
┌──────────────────────────┐
│ JevScope API             │
│ Node.js                  │
│                          │
│ - request validation     │
│ - size/rate safeguards   │
│ - provider selection     │
│ - secret boundary        │
└────────────┬─────────────┘
             │ server-side credential
             v
┌──────────────────────────┐
│ TypeSafe API             │
│ System One / Jev         │
└──────────────────────────┘
```

## Monorepo boundaries

### `@jevscope/core`

Owns:

- project schema
- domain types
- confidence policy
- normalized answer helpers
- migrations

Must not depend on:

- React
- TypeSafe SDK
- Node HTTP server

### `@jevscope/provider-typesafe`

Owns:

- mapping JevScope questions to TypeSafe request shape
- TypeSafe client lifecycle
- provider-specific errors
- normalized provider response envelope

### `@jevscope/evaluator`

Owns:

- batch scheduling
- bounded concurrency
- comparison
- regression expectations
- aggregate metrics

Depends on provider interface, not concrete TypeSafe implementation.

### `apps/api`

Owns:

- HTTP boundary
- request validation
- body limits
- provider construction
- environment/secrets
- response status codes

### `apps/studio`

Owns:

- editing
- visualization
- local UX state
- importing/exporting files
- calling local API

## Provider interface

```ts
export interface DecisionProvider {
  evaluate(request: EvaluationRequest): Promise<EvaluationResult>;
  id(): string;
}
```

The v0.1 implementation is `TypeSafeDecisionProvider`.

Future provider adapters are allowed only if they return a clearly normalized result and preserve provider-specific raw data separately.

## Data flow

1. Studio validates project locally.
2. Studio sends state + questions + optional model.
3. API validates again at trust boundary.
4. provider maps request to TypeSafe System One.
5. provider receives typed answers.
6. API returns normalized result + raw provider metadata.
7. Studio applies local confidence policy.
8. history entry is stored locally.
9. batch/compare reuse the same evaluation contract.

## Failure model

Distinguish:

- `validation_error`
- `provider_auth_error`
- `provider_rate_limit`
- `provider_timeout`
- `provider_connection_error`
- `provider_response_error`
- `aborted`
- `internal_error`

Do not collapse all failures into “Jev failed”.
