# Security Policy

## Architecture

Quali is a client-side Progressive Web App. All data is stored in the browser's IndexedDB. The application makes **zero external network requests** — no APIs, no telemetry, no cloud sync.

This architecture eliminates entire classes of vulnerabilities (server-side injection, data breaches, man-in-the-middle attacks). The primary attack surface is limited to:

- **Import sanitization**: Malicious content in imported text files (XSS via document content)
- **Supply chain**: Compromised npm dependencies
- **Local storage**: Browser-level IndexedDB access by other origins (mitigated by same-origin policy)

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
| Older   | No        |

We recommend always using the latest version at [quali.ogio.dev](https://quali.ogio.dev).

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email**: [hi@ogio.dev](mailto:hi@ogio.dev)
2. **Subject**: `[SECURITY] Quali — Brief description`
3. **Include**: Steps to reproduce, impact assessment, affected versions

**Do not** open a public GitHub issue for security vulnerabilities.

### Response timeline

| Severity | Acknowledgment | Patch target |
|----------|---------------|--------------|
| Critical | 24 hours      | 72 hours     |
| High     | 48 hours      | 1 week       |
| Medium   | 1 week        | Next release |
| Low      | 1 week        | Best effort  |

## Security measures

- **Content Security Policy**: `default-src 'self'` prevents external resource loading
- **Input sanitization**: All imported document content is sanitized before rendering
- **Dependency auditing**: `npm audit` in CI pipeline
- **No authentication**: No credentials to steal — the tool has no accounts
- **No network**: Verifiable by monitoring the Network tab in DevTools

## Coordinated Disclosure

We follow a 90-day coordinated disclosure policy. After reporting, we ask that you allow up to 90 days before public disclosure to give us time to develop and release a fix.
