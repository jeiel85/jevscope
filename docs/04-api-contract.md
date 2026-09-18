# Local API Contract

Base URL in development:

```text
http://localhost:4317
```

## `GET /health`

Response:

```json
{
  "ok": true,
  "provider": "typesafe",
  "configured": true
}
```

Never return the API key.

## `POST /api/evaluate`

Request:

```json
{
  "state": {
    "hp": 32,
    "enemyCount": 4
  },
  "questions": {
    "nextAction": {
      "type": "choice",
      "instructions": "Choose the next action.",
      "criteria": {
        "attack": null,
        "retreat": null
      }
    }
  },
  "model": "jev-latest"
}
```

Response:

```json
{
  "provider": "typesafe",
  "model": "jev-latest",
  "answers": {
    "nextAction": {
      "type": "choice",
      "choice": "retreat",
      "confidence": 0.81,
      "probabilities": {
        "attack": 0.19,
        "retreat": 0.81
      }
    }
  },
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "meta": {
    "latencyMs": 114
  }
}
```

`usage` values are forwarded from the provider result; consumers must not assume nonzero values.

## Errors

```json
{
  "error": {
    "code": "validation_error",
    "message": "questions.nextAction.criteria must contain at least two labels"
  }
}
```

Status mapping:

| Error | HTTP |
|---|---:|
| validation | 400 |
| auth/config | 401/503 |
| rate limit | 429 |
| provider timeout | 504 |
| provider failure | 502 |
| internal | 500 |

## CORS

Development default allows only the configured Studio origin.

Production deployment should prefer same-origin API routes.
