# ADR-001: Provider Boundary

Status: Accepted  
Date: 2026-09-19

## Decision

Define a provider interface in JevScope and isolate TypeSafe-specific code in `@jevscope/provider-typesafe`.

## Why

JevScope's domain is decision debugging/evaluation, not one HTTP client implementation.

Isolation provides:

- testability
- mock providers
- API evolution containment
- potential comparison adapters later

## Constraint

v0.1 UX and semantics are explicitly designed around Jev's `choice`, `score`, and `noul`.
Provider abstraction must not erase those semantics into a generic chat-completion shape.
