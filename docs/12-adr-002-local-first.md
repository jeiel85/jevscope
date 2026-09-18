# ADR-002: Local-First Studio

Status: Accepted  
Date: 2026-09-19

## Decision

v0.1 has no user account or remote JevScope database.

Projects are plain files; history/settings remain local by default.

## Why

- lowest operational complexity
- aligns with developer-tool expectations
- reduces privacy risk
- allows Git-based workflow
- makes self-hosting straightforward

## Exception

Live Jev evaluation is necessarily remote when using the TypeSafe provider.
The UI must distinguish local operations from remote evaluation.
