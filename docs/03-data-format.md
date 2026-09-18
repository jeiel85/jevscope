# JevScope Project Format

File suffix:

```text
*.jevscope.json
```

## Version 1

```json
{
  "schemaVersion": 1,
  "name": "RPG Battle Director",
  "description": "Example decision policy",
  "provider": {
    "type": "typesafe",
    "model": "jev-latest"
  },
  "questions": {
    "nextAction": {
      "type": "choice",
      "instructions": "Choose the most appropriate immediate action.",
      "criteria": {
        "attack": "Engage the current enemy.",
        "retreat": "Create distance and avoid immediate combat.",
        "heal": "Use available healing.",
        "wait": "Do not commit to another action yet."
      }
    },
    "danger": {
      "type": "score",
      "instructions": "Rate current combat danger.",
      "criteria": [
        "Safe",
        "Manageable",
        "Dangerous",
        "Critical"
      ]
    },
    "shouldUseSpecial": {
      "type": "noul",
      "instructions": "Should the character use the special ability now?",
      "criteria": {
        "true": "Benefits justify consuming the ability.",
        "false": "Preserve the ability."
      }
    }
  },
  "policy": {
    "choiceConfidence": {
      "auto": 0.85,
      "review": 0.60
    },
    "scoreConfidence": {
      "auto": 0.85,
      "review": 0.60
    },
    "noul": {
      "yes": 0.80,
      "no": 0.20
    }
  }
}
```

## Important semantics

### State / entry values

TypeSafe System One accepts a top-level state/instruction/criterion entry as text, a JSON object, a JSON array, or `null`. Nested JSON values may contain numbers and booleans. JevScope v0.1 validates this boundary rather than forwarding arbitrary JavaScript values.


### Choice

Provider output contains:

- selected `choice`
- `confidence`
- probabilities keyed by label

### Score

Provider output contains:

- expected `score` (may be between rubric integers)
- `confidence`
- rubric legend
- probabilities keyed by score

Do not round the expected score before displaying it.

### Noul

Provider output contains a `noul` number from 0 to 1 representing the probability of YES.

JevScope may derive a local policy label:

```text
p >= yes threshold       => YES/AUTO
p <= no threshold        => NO/AUTO
otherwise                => REVIEW
```

The derived label is JevScope policy output, not the raw Jev answer.

## JSONL batch format

Each line:

```json
{"id":"case-001","state":{"hp":100,"enemyCount":1,"ammo":10}}
```

Optional expectations:

```json
{
  "id":"case-002",
  "state":{"hp":12,"enemyCount":5,"ammo":1},
  "expect":{
    "nextAction":{"choiceOneOf":["retreat","heal"],"minConfidence":0.55},
    "danger":{"scoreMin":2.3},
    "shouldUseSpecial":{"noulMin":0.50}
  }
}
```

## Schema evolution rules

- bump `schemaVersion` for semantic changes
- reject unknown future versions rather than guessing
- migrations must be explicit and reversible where possible
- credentials are forbidden fields
