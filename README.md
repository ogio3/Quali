# Quali-Lite

Qualitative coding tool that runs entirely in your browser.

## Principles

- **Local-first** — Your data stays in your browser. No server. No account.
- **Offline** — Works without internet (PWA).
- **No telemetry** — No analytics, no cookies, no tracking.
- **Open source** — MIT License.
- **Free forever** — No ads, no premium tier.

## Features

- Import text documents (paste, drag & drop .txt/.md/.docx)
- Create codes with colors and keyboard shortcuts (1-9)
- Select text and assign codes with one click or keypress
- Visual highlighting with code colors
- Export coded segments as CSV
- Export/import full project backups as JSON
- Undo with Ctrl/Cmd+Z

## Privacy

Your data never leaves your browser. All data is stored in IndexedDB on your device. There is no server component — the application is a static site that runs entirely client-side.

This makes Quali-Lite suitable for research involving sensitive data, as no data processing agreement (DPA) is required.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `build/` — static files ready for any hosting.

## License

MIT
