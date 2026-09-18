# Security Policy

## Supported branch

Security fixes target `main` until the first stable release.

## Secrets

- Never commit `TYPESAFE_API_KEY`.
- Never expose the key to browser JavaScript.
- Never store the key inside `.jevscope.json`.
- `.env` is ignored by Git.

## Reporting

Please open a private GitHub security advisory when the repository enables security reporting.
Do not publish working credential-exfiltration proofs in a public issue.

## Threat model

Primary v0.1 risks:

- API key exposure
- malicious imported project files
- oversized JSON/JSONL causing resource exhaustion
- accidental submission of sensitive state to a remote provider
- unsafe future action adapters

See `docs/07-security-privacy.md`.
