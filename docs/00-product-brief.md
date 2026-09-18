# Product Brief

## Product

**JevScope — Visual Decision Debugger & Testbench for Jev**

## Problem

Structured decision models move complexity from text parsing to decision engineering:

- state design
- criteria design
- uncertainty thresholds
- regression behavior
- evaluation datasets
- policy safety

Developers need tooling that makes these concerns inspectable and versionable.

## Users

Primary:

- developers evaluating Jev
- agent/tool-routing developers
- automation developers
- game-AI developers
- teams adding confidence-gated workflows

Secondary:

- ML/platform engineers comparing decision policies
- maintainers reproducing Jev behavior from issue reports

## Core job-to-be-done

> Given a state and decision definition, let me see exactly what Jev returned, how uncertain it was, whether my policy would act, and whether edits change previously accepted behavior.

## Product principles

- decision-first, not chat-first
- uncertainty is a first-class artifact
- local-first project/history storage
- secrets remain server-side
- plain-text project files work well with Git
- no account required
- provider boundary remains replaceable

## Success criteria for v0.1

A new contributor can:

1. clone repository
2. set a TypeSafe key
3. launch locally
4. open the included game-AI example
5. run a single case
6. inspect probabilities
7. classify the result via policy thresholds
8. run a JSONL batch
9. compare two decision definitions
10. understand all of this from README/docs without maintainer help
