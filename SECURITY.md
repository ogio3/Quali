# Security

## Architecture

Quali is a client-side Progressive Web App. All data is stored in IndexedDB. The application makes **zero external network requests** — no APIs, no telemetry, no cloud sync.

This architecture eliminates entire classes of vulnerabilities: server-side injection, data breaches, man-in-the-middle attacks.

The remaining attack surface:

- **Import sanitization** — Malicious content in imported files (XSS via document content)
- **Supply chain** — Compromised npm dependencies
- **Local storage** — Browser-level IndexedDB access (mitigated by same-origin policy)

## Measures

| Layer | Protection |
|-------|-----------|
| Content Security Policy | `default-src 'self'` — no external resources |
| Input sanitization | All imported content is sanitized before rendering |
| Dependency auditing | `npm audit` in CI |
| No authentication | No credentials to steal — no accounts exist |
| No network | Verifiable via DevTools Network tab |

## Supported versions

Always use the latest version at [quali.ogio.dev](https://quali.ogio.dev).

## Reporting a vulnerability

**Email**: [hi@ogio.dev](mailto:hi@ogio.dev)
**Subject**: `[SECURITY] Quali — Brief description`
**Include**: Steps to reproduce, impact assessment, affected versions.

Do not open a public GitHub issue for security vulnerabilities.

| Severity | Acknowledgment | Patch target |
|----------|---------------|--------------|
| Critical | 24 hours | 72 hours |
| High | 48 hours | 1 week |
| Medium/Low | 1 week | Next release |

We follow a 90-day coordinated disclosure policy.
