<p align="center">
  <img src="static/icon.svg" width="48" height="48" alt="Quali" />
</p>

<h3 align="center">Quali</h3>

<p align="center">
  Qualitative coding for academic researchers.<br />
  Runs entirely in your browser. No server. No account. No tracking.
</p>

<p align="center">
  <a href="https://quali.ogio.dev">Open Quali</a>&ensp;·&ensp;<a href="#features">Features</a>&ensp;·&ensp;<a href="SECURITY.md">Security</a>&ensp;·&ensp;<a href="CONTRIBUTING.md">Contributing</a>
</p>

---

### Why

Existing qualitative tools cost $1,500/year, require installation approval, and upload your data to someone else's server. Interview transcripts contain real people's stories — they deserve better.

Quali keeps everything in your browser's local storage. Open the URL, start coding. Your data never touches a network.

---

### Features

**Core workflow**

- Import documents — paste, drag & drop, or file picker (.txt .md .docx)
- Select text → assign a code with one click, keyboard shortcut (1–9), or ⌘K palette
- Visual highlighting that preserves complex scripts (Arabic, CJK, Devanagari, Thai)
- Code Retrieval — click a code to see every segment across all documents
- Click a segment to jump back to its context in the source document

**Organization**

- Analytic memos — project-level and linked to individual codes
- Code merge — combine two codes without losing segments
- Document rename

**Export**

- CSV (segments with codes and document names)
- JSON project backup (full round-trip restore)
- REFI-QDA .qdpx (interoperable with NVivo, ATLAS.ti, MAXQDA)

**Design**

- Dark and light themes
- Keyboard-driven — ⌘K command palette, 1–9 quick assign, ⌘Z undo
- Offline-capable PWA

---

### Principles

| | |
|---|---|
| **Local-first** | Data lives in IndexedDB on your device. Zero network requests. |
| **No telemetry** | No analytics. No cookies. No fingerprinting. |
| **Free forever** | No ads. No premium tier. MIT licensed. |
| **Interoperable** | REFI-QDA export ensures your work is never locked in. |

---

### Privacy

All data stays in your browser. There is no server component — Quali is a static site. This makes it suitable for sensitive research data without requiring a data processing agreement (DPA).

Open your browser's DevTools Network tab while using Quali. You will see zero outgoing requests.

---

### Development

```
npm install
npm run dev
```

### Build

```
npm run build
```

Static output in `build/`, deployable to any hosting.

---

### License

MIT — Tomohito Oginome
