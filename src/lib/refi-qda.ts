/**
 * REFI-QDA Export — Qualitative Data Exchange Standard
 *
 * Implements REFI-QDA 1.0 (the only stable version of the standard).
 * Namespace: urn:QDA-XML:project:1.0 / urn:QDA-XML:codebook:1.0
 *
 * Exports:
 *   .qdpx — Full project (ZIP archive: project.qde + Sources/*.txt)
 *   .qdc  — Codebook only (single XML file, codes + colors + hierarchy)
 *
 * References:
 *   - https://www.qdasoftware.org/
 *   - Compatible with: NVivo, ATLAS.ti, MAXQDA, QualCoder, Quirkos, Taguette
 */

import { zipSync } from 'fflate';
import type { Project, Document, Code, Segment } from './db';

const NS_PROJECT = 'urn:QDA-XML:project:1.0';
const NS_CODEBOOK = 'urn:QDA-XML:codebook:1.0';

function uuid(): string {
  return crypto.randomUUID();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colorToHex(color: string): string {
  // Ensure #RRGGBB format (strip alpha if present)
  if (color.startsWith('#') && color.length === 7) return color.toUpperCase();
  if (color.startsWith('#') && color.length === 4) {
    const [, r, g, b] = color;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return color.toUpperCase();
}

// ── Codebook Export (.qdc) ─────────────────────────────────────────────

export function exportCodebookQdc(codes: Code[]): string {
  const codeElements = codes.map(c =>
    `    <Code guid="${uuid()}" name="${escapeXml(c.name)}" color="${colorToHex(c.color)}" isCodable="true" />`
  ).join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<CodeBook xmlns="${NS_CODEBOOK}">
  <Codes>
${codeElements}
  </Codes>
</CodeBook>`;
}

// ── Full Project Export (.qdpx) ────────────────────────────────────────

export function exportProjectQdpx(
  project: Project,
  documents: Document[],
  codes: Code[],
  segments: Segment[]
): Uint8Array {
  // Build GUID maps (nanoid → UUID) for cross-referencing
  const docGuids = new Map<string, string>();
  const codeGuids = new Map<string, string>();

  for (const doc of documents) docGuids.set(doc.id, uuid());
  for (const code of codes) codeGuids.set(code.id, uuid());

  // Group segments by document
  const segsByDoc = new Map<string, Segment[]>();
  for (const seg of segments) {
    const list = segsByDoc.get(seg.documentId) ?? [];
    list.push(seg);
    segsByDoc.set(seg.documentId, list);
  }

  // Build code elements
  const codeXml = codes.map(c =>
    `      <Code guid="${codeGuids.get(c.id)}" name="${escapeXml(c.name)}" color="${colorToHex(c.color)}" isCodable="true" />`
  ).join('\n');

  // Build source elements with selections and codings
  const sourceXml = documents.map(doc => {
    const docGuid = docGuids.get(doc.id)!;
    const docSegs = segsByDoc.get(doc.id) ?? [];
    const fileName = sanitizeFilename(doc.name) + '.txt';

    const selectionsXml = docSegs.map(seg => {
      const codeGuid = codeGuids.get(seg.codeId);
      if (!codeGuid) return '';
      return `        <PlainTextSelection guid="${uuid()}" name="" startPosition="${seg.startOffset}" endPosition="${seg.endOffset}">
          <Coding guid="${uuid()}">
            <CodeRef targetGUID="${codeGuid}" />
          </Coding>
        </PlainTextSelection>`;
    }).filter(Boolean).join('\n');

    return `      <TextSource guid="${docGuid}" name="${escapeXml(doc.name)}" plainTextPath="Sources/${escapeXml(fileName)}" creatingUser="${uuid()}" creationDateTime="${new Date(doc.createdAt).toISOString()}">
${selectionsXml}
      </TextSource>`;
  }).join('\n');

  // Assemble project.qde
  const projectXml = `<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="${NS_PROJECT}" name="${escapeXml(project.name)}" origin="ogio Quali" creatingUserGUID="${uuid()}" creationDateTime="${new Date(project.createdAt).toISOString()}">
  <Users>
    <User guid="${uuid()}" name="Researcher" />
  </Users>
  <CodeBook>
    <Codes>
${codeXml}
    </Codes>
  </CodeBook>
  <Sources>
${sourceXml}
  </Sources>
</Project>`;

  // Build ZIP archive
  const encoder = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    'project.qde': encoder.encode(projectXml),
  };

  // Add source text files
  for (const doc of documents) {
    const fileName = sanitizeFilename(doc.name) + '.txt';
    files[`Sources/${fileName}`] = encoder.encode(doc.content);
  }

  return zipSync(files);
}

function sanitizeFilename(name: string): string {
  // Remove path traversal and special characters
  return name
    .replace(/[\/\\:*?"<>|]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/^\./g, '_')
    .slice(0, 200);
}

// ── Download helpers ──────────────────────────────────────────────────

export function downloadQdpx(data: Uint8Array, projectName: string): void {
  const blob = new Blob([data as unknown as ArrayBuffer], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(projectName)}.qdpx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadQdc(xml: string, projectName: string): void {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(projectName)}-codebook.qdc`;
  a.click();
  URL.revokeObjectURL(url);
}
