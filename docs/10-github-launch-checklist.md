# GitHub Launch Checklist

## Repository

- [ ] create `jevscope`
- [ ] default branch `main`
- [ ] add description
- [ ] add topics:
  - `jev`
  - `typesafe-ai`
  - `ai-evaluation`
  - `decision-model`
  - `developer-tools`
  - `typescript`
  - `local-first`
- [ ] enable Issues
- [ ] enable Discussions if desired
- [ ] enable private vulnerability reporting
- [ ] branch protection after CI is green

## First commit

Suggested:

```text
chore: bootstrap JevScope decision workbench
```

## First issues

1. `feat: implement project schema v1 validation`
2. `feat: connect workbench to local evaluate API`
3. `feat: render Choice probability inspector`
4. `feat: render Score distribution inspector`
5. `feat: render Noul probability and local threshold state`
6. `feat: persist run history in IndexedDB`
7. `feat: add JSONL batch evaluator`
8. `feat: add A/B project comparison`
9. `test: add mocked provider contract fixtures`
10. `docs: record first JevScope demo GIF`

## Milestones

- `v0.1 Decision Workbench`
- `v0.2 Evaluation`
- `v0.3 Integrations`

## README media

Before wider promotion, add:

- one 10–20 second GIF of single evaluation
- one screenshot of compare view
- one screenshot of batch report

## Release

For first tagged release:

```text
v0.1.0
```

Release notes should disclose:

- supported question types
- provider/API-key requirements
- local-first privacy behavior
- known limits
- project schema version
