# Security & Privacy

## Key rule

**The browser never receives `TYPESAFE_API_KEY`.**

The official TypeSafe SDK explicitly guards against accidental browser use because doing so would expose the key.

## Data boundary

A live Jev run sends the supplied state/questions to the configured remote provider.
JevScope must show this clearly before first live execution.

Local-only operations:

- project editing
- schema validation
- policy classification
- expectation evaluation
- comparison math
- history browsing (default)

Remote operation:

- live provider evaluation

## Local storage

v0.1 recommendation:

- settings: localStorage
- history: IndexedDB
- imported project/case data: memory unless user explicitly saves
- API key: process environment only

## Import safety

Imported `.jevscope.json` and `.jsonl` are data, never executable code.

Mitigations:

- schema validation
- body size limit
- line count limit for UI import
- no dynamic `eval`
- no HTML injection from labels/descriptions
- escaped rendering
- abortable batch jobs

## Network hardening

API server:

- bind localhost by default
- strict CORS origin
- body size limit
- timeout provider requests
- do not log Authorization headers
- do not log full state by default
- return sanitized errors

## Future action adapters

If JevScope later executes tools/actions:

- separate “decision” from “execution”
- require explicit capability grants
- preview side effects
- support dry-run
- log the exact action request
- confidence alone must not authorize high-impact actions
