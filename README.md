# Quali

Qualitative coding tool that runs entirely in your browser. Built for academic researchers.

## Principles

- **Local-first** — Your data stays in your browser. No server. No account.
- **Offline** — Works without internet (PWA).
- **No telemetry** — No analytics, no cookies, no tracking.
- **Open source** — MIT License.
- **Free forever** — No ads, no premium tier.

## Features

- Import text documents (paste, drag & drop, file picker — .txt .md .docx)
- Create codes with curated color palette and keyboard shortcuts (1–9)
- Select text and assign codes with one click, keypress, or Command Palette (⌘K)
- Div Overlay highlighting — preserves Arabic, CJK, Devanagari, Thai text shaping
- Code Retrieval View — click a code to see all segments across documents
- Analytic memos (project-level and code-linked)
- Code merge
- Export: CSV, JSON backup, REFI-QDA (.qdpx)
- Undo with ⌘Z
- Dark and light themes

## Privacy

Your data never leaves your browser. All data is stored in IndexedDB on your device. There is no server component — the application is a static site that runs entirely client-side.

This makes Quali suitable for research involving sensitive data, as no data processing agreement (DPA) is required.

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
