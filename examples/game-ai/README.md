# Game AI Example

This example is intentionally small and visual.

Input state represents combat conditions. Jev answers:

- `nextAction` — Choice
- `danger` — Score
- `shouldUseSpecial` — Noul probability

The example is useful because all three Jev question primitives can be inspected in one run.

## Demo goal

The eventual Studio demo should animate state changes and display:

```text
nextAction
RETREAT        0.72
attack         0.15
heal           0.09
wait           0.04

danger
expected score 2.61

shouldUseSpecial
YES probability 0.67
=> local policy: REVIEW
```

Do not claim these example numeric values are actual Jev outputs; they are UI illustration only.
