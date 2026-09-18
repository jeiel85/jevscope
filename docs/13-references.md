# References

Verified on 2026-09-19.

## TypeSafe AI

- TypeSafe AI launch / System One / Jev:
  https://typesafe.ai/blog/introducing-system-one-models-and-jev

- Official JavaScript/TypeScript SDK:
  https://github.com/typesafe-ai/typesafe-sdk-js

- Official SDK package:
  `@typesafe-ai/sdk`

Verified SDK facts used by this design:

- Node.js 20+
- environment key `TYPESAFE_API_KEY`
- default API base: `https://api.typesafe.ai`
- default model alias in SDK: `jev-latest`
- System One endpoint exposed by SDK client
- supported question types: `choice`, `score`, `noul`
- Choice response: selected label + confidence + label probabilities
- Score response: expected score + confidence + legend + probabilities
- Noul response: YES probability in `noul`
- browser use is refused by default to avoid exposing API keys
- SDK repository package version observed: `0.6.0`

## Vercel

- Jev on AI Gateway:
  https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway

- Jev model page:
  https://vercel.com/ai-gateway/models/jev

Vercel describes Jev as a probabilistic decision model returning typed Choice, Score, and Boolean-style decisions with probabilities. JevScope uses TypeSafe's canonical SDK term `noul` for the yes/no primitive.

## Dependency versions observed during design

- React: 19.3.0
- Vite: 8.3.0
- Vitest: 5.0.1
- Zod: 4.6.5

These are starting pins, not a long-term compatibility promise.
